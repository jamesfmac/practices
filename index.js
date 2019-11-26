const { PORT } = require("./config");
const { app, receiver } = require("./boltApp");
const { updatePracticesLog } = require("./airtable/practicesLog");


const { feedbackView } = require("./slack/views/feedback");
const { insertFeedback } = require("./airtable/userFeedback");

const {sendReminders, generatePractices} = require("./scripts")




const {
  scheduleReminders,
  schedulePracticeGeneration
} = require("./scripts/schedule");

// Listener middleware that filters out messages with 'bot_message' subtype
function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== "bot_message") {
    next();
  }
}

//send reminders to all team leads
app.message("remind-all", async ({ message, context }) => {
  try {
    // Call the chat.scheduleMessage method with a token
    sendReminders();
  } catch (error) {
    console.error(error);
  }
});

//listeners for responding to practice updates

app.action(
  "completed_practice",
  async ({ body, ack, context, action, payload }) => {
    ack();
    try {
      const updatePracticeLog = await updatePracticesLog({
        id: payload.value,
        fields: {
          Status: "Completed"
        }
      });

      const originalBlocks = body.message.blocks;
      const actionBlockID = action.block_id;

      const updatedBlocks = updatePracticeLog
        ? originalBlocks.map(block =>
            block.block_id === actionBlockID
              ? {
                  type: "context",
                  elements: [
                    {
                      type: "mrkdwn",
                      text: ":white_check_mark: *Practice Completed*"
                    }
                  ]
                }
              : block
          )
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
      console.log(error);
    }
  }
);

app.action(
  "missed_practice",
  async ({ body, ack, say, context, action, payload }) => {
    ack();
    try {
      const updatePracticeLog = await updatePracticesLog({
        id: payload.value,
        fields: {
          Status: "Missed"
        }
      });
      const originalBlocks = body.message.blocks;
      const actionBlockID = action.block_id;

      const updatedBlocks = updatePracticeLog
        ? originalBlocks.map(block =>
            block.block_id === actionBlockID
              ? {
                  type: "context",
                  elements: [
                    {
                      type: "mrkdwn",
                      text: ":octagonal_sign: *Practice Skipped*"
                    }
                  ]
                }
              : block
          )
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
      console.log(error);
    }
  }
);

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

app.command("/practicely", async ({ command, ack, payload, say }) => {
  // Acknowledge command request
  console.log(payload.text);
  ack();

  const input = payload.text;

  switch (input) {
    case "ping":
      say("Status OK");
      break;
    case "remind":
      sendReminders();
      say("Reminders away");
      break;
    case "create":
      generatePractices();
      say("Creating practices");
      break;
    default:
      say("I don't know that one");
  }
});

app.view("feedback", async ({ ack, body, view, context }) => {
  ack();
  console.log(body);

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

// health check for EB

receiver.app.get("/", (req, res, next) => {
  res.json({ status: "Ok" });
  res.status(200).send(); // respond 200 OK to the default health check method
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
