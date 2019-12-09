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

    const practicesList = dayGroup.practices.map(practice => {
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${practice.practice}`,
            verbatim: false
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `>*Project* ${practice.project}`,
              verbatim: false
            },
            {
              type: "mrkdwn",
              text: `*Status* Pending`,
              verbatim: false
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Completed ",
                emoji: true
              },
              action_id: 'updateStatusButtonComplete',
              value: `${practice.id}`,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Missed",
                emoji: true
              },
              action_id: 'updateStatusButtonMissed',
              value: `${practice.id}`
            }
          ]
        }
      ];
    });

    return [...dateHeading].concat(...practicesList);
  });

  const altBody = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Awesome! You don't have any practices that need updating.*`,
        verbatim: false
      }
    }
  ];

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
      text: "Finished",
      emoji: true
    },
    blocks: blocks
  };
};
