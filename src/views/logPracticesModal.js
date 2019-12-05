const moment = require("moment-timezone");

module.exports = async practices => {
  const dayBlocks = practices.map(dayGroup => {
    const dateHeading = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${moment(dayGroup.date).format("dddd, Do MMM")}*`,
          verbatim: false
        }
      }
    ];

    const divider = [
      {
        type: "divider"
      }
    ];

    const practicesList = dayGroup.practices.map(practice => {
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${practice.practice}`,
            verbatim: false
          },
          accessory: {
            type: "static_select",
            action_id: "setPracticeStatusFromModal",
            placeholder: {
              type: "plain_text",
              text: "Status",
              emoji: true
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Completed",
                  emoji: true
                },
                value: `${practice.id}-completed`
              },
              {
                text: {
                  type: "plain_text",
                  text: "Missed",
                  emoji: true
                },
                value: `${practice.id}-missed`
              }
            ]
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `>:ledger: Project: *${practice.project}*`,
              verbatim: false
            }
          ]
        }
      ];
    });

    return [...dateHeading].concat(...practicesList).concat(...divider);
  });

  const altBody = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Awesome! You don't have any practices pending.*`,
        verbatim: false
      }
    }
  ];
  console.log('issues to update', dayBlocks.length)

  const body = dayBlocks.length >= 1 ? dayBlocks : altBody;

  const blocks = [].concat(...body);

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Update Practices",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Close",
      emoji: true
    },
    blocks: blocks
  };
};
