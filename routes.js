const {
  open_practices_logActionHandler,
  show_helpActionHandler,
  create_practicesActionHandler,
  remind_allActionHandler,
  admin_overflowActionHandler
} = require("./slack/actions");

const { practicelySlashHandler } = require("./slack/commands");

const { feedbackView } = require("./slack/views/feedback");
const { insertFeedback } = require("./airtable/userFeedback");
const { updatePracticesLog } = require("./airtable/practicesLog");

module.exports = function(app) {
  app.command("/practicely", practicelySlashHandler);
  app.action("open_practices_log", open_practices_logActionHandler);
  app.action("show_help", show_helpActionHandler);
  app.action("create_practices", create_practicesActionHandler);
  app.action("remind_all", remind_allActionHandler);
  app.action("admin_overflow", admin_overflowActionHandler);


  //TODO refactor to use controllers

app.action(
    "open_feedback_form",
    async ({ body, context, say, payload, ack, event }) => {
      ack();
  
      try {
        const view = await feedbackView(body);
  
        app.client.views
          .open({
            token: context.botToken,
            trigger_id: body.trigger_id,
            view: view
          })
          .catch(error => console.log(error));
      } catch (error) {
        console.error(error);
      }
    }
  );
  
  app.action(
    "select_practice_status",
    async ({ body, context, say, payload, ack }) => {
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
  
        const result = await app.client.chat.update({
          token: context.botToken,
          ts: body.message.ts,
          channel: body.channel.id,
          text: body.message.text,
          as_user: true,
          blocks: updatedBlocks
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
  
  app.view("feedback", async ({ ack, body, view, context }) => {
    ack();
  
    try {
      const improvementResponse =
        view["state"]["values"]["feedback_improvment"]["feedback_improvment_ml"];
      const otherResponse =
        view["state"]["values"]["feedback_other"]["feedback_other_ml"];
  
      insertFeedback(
        body.user.username,
        improvementResponse.value,
        otherResponse.value
      );
    } catch (error) {
      console.log(error);
    }
  });

  

};
