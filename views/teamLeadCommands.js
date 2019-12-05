module.exports = async body => {
  const text = `Hey <@${body.user_id}>`;

  const intro = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:zap:`
      }
    }
  ];

  const actions = [
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
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Provide Feedback ",
            emoji: true
          },
          action_id: "open_feedback_form",
          value: "feedback"
        }
      ]
    }
  ];

  const blocks = [...intro].concat(...actions);

  return { text: text, blocks: blocks };
};
