const moment = require("moment-timezone");

module.exports = async (slackUserID, practices) => {
  const numberOfPractices = practices.length;

  const text =
    numberOfPractices > 1
      ? `<@${slackUserID}> you have ${numberOfPractices} outstanding practices`
      : `<@${slackUserID}> you have ${numberOfPractices} outstanding practice`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: text
      }
    }
  ];
  const actionsBlock = [
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Update Practices",
            emoji: true
          },

          action_id: "open_practices_log",
          style: "primary"
        }
      ]
    }
  ];

  return {
    text: text,
    blocks: [].concat(...introBlock).concat(...actionsBlock)
  };
};
