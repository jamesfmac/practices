const { updatePracticesLog } = require("../APIs/airtable/practicesLog");
const { chatUpdate } = require("../APIs/slack");

const analytics = require("../APIs/segment")

module.exports = async ({ body, context, payload, ack }) => {
  ack();

  try {
    const originalBlocks = body.message.blocks;
    const indexOfActionedPractice = originalBlocks.findIndex(
      x => x.block_id === payload.block_id
    );

    const splitInputValue = payload.selected_option.value.split("-");
    const newStatus =
      splitInputValue[1] == "completed" ? "Completed" : "Missed";

    const updatePracticeLog = await updatePracticesLog({
      id: splitInputValue[0],
      fields: {
        Status: newStatus
      }
    });

    const updatedBlocks = updatePracticeLog
      ? originalBlocks.map((block, index) => {
          return index === indexOfActionedPractice + 1
            ? {
                type: "context",
                elements: [
                  {
                    type: "mrkdwn",
                    text: `:arrow_right: *Status:* ${newStatus}`
                  }
                ]
              }
            : block;
        })
      : originalBlocks;

    const result = await chatUpdate({
      token: context.botToken,
      ts: body.message.ts,
      channel: body.channel.id,
      text: body.message.text,
      blocks: updatedBlocks
    });



analytics.track({
  userId: body.user.id,
  event: `Practice ${newStatus}`,
  properties: {
    name: updatePracticeLog[0].fields.PRACTICE_NAME[0],
    date: updatePracticeLog[0].fields.Date,
    project: updatePracticeLog[0].fields.PROJECT_NAME[0],
    location: 'daily reminder'
  }
});

  } catch (error) {
    console.error(error);
  }
};
