module.exports = async body => {
  const text = `Hey <@${body.user_id}>`;



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
            text: "Show Week",
            emoji: true
          },
          action_id: "openWeekyPLan"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":postbox: Feedback",
            emoji: true
          },
          action_id: "open_feedback_form",
          value: "feedback"
        }
      ]
    }
  ];

  const blocks = [...actions];

  return { text: text, blocks: blocks };
};
