const { updatePracticesLog } = require("../APIs/airtable/practicesLog");
const { chatUpdate } = require("../APIs/slack");

module.exports = async ({ body, context, say, payload, ack }) => {
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
  } catch (error) {
    console.error(error);
  }
};
