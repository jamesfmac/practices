const { PORT } = require("./config");
const { app } = require("./app");

const { sendReminders } = require("./scripts/sendReminders");
const { sendSlackDM } = require("./sendSlackDM");


const tempdata = async () => {
  data = await sendReminders(app, "2019-11-14");
};
//tempdata();

// Listener middleware that filters out messages with 'bot_message' subtype
function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== "bot_message") {
    next();
  }
}

// Listens to incoming messages that contain "hello"
app.message("hello", ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me"
          },
          action_id: "button_click"
        }
      }
    ]
  });
});

app.action("button_click", ({ body, ack, say }) => {
  ack();
  say(`<@${body.user.id}> clicked the button`);
});

// Listen for a slash command invocation
app.command("/ticket", ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Modal title"
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Welcome to a modal with _blocks_"
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click me!"
              },
              action_id: "button_abc"
            }
          },
          {
            type: "input",
            block_id: "input_c",
            label: {
              type: "plain_text",
              text: "What are your hopes and dreams?"
            },
            element: {
              type: "plain_text_input",
              action_id: "dreamy_input",
              multiline: true
            }
          }
        ],
        submit: {
          type: "plain_text",
          text: "Submit"
        }
      }
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.message("ping", async ({ message, context }) => {
  try {
    // Call the chat.scheduleMessage method with a token
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Yee haaa!.`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",

            text: {
              type: "plain_text",
              text: "Update Practices"
            },
            url:
              "https://airtable.com/tblU7zcWqsp1zZOJU/viw2PpDAliaSVYFu7?blocks=hide",
            action_id: "view_practices"
          }
        ]
      }
    ];

    const result = await sendSlackDM(
      "jamesm@stratejos.ai",
      "something cool",
      blocks
    );

  
  } catch (error) {
    console.error(error);
  }
});


app.message("remind", async ({ message, context }) => {
  try {
    // Call the chat.scheduleMessage method with a token
   sendReminders()
  
  } catch (error) {
    console.error(error);
  }
});

app.action("view_practices", ({ body, ack, say }) => {
  ack();
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

