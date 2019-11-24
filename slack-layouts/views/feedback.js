const feedbackView = payload => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Feedback on Practicely",
      emoji: true
    },
    callback_id: "feedback",
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `:wave: Hey  <@${payload.user_name}>!\n\nWe'd love to hear about your experience with practicely and what would make it better for you.`,
          emoji: true
        }
      },
      {
        type: "divider"
      },

      {
        type: "input",
        block_id: "feedback_improvment",
        label: {
          type: "plain_text",
          text: "How can practicely be improved?",
          emoji: true
        },
        element: {
          type: "plain_text_input",
          action_id: "feedback_improvment_ml",
          multiline: true
        }
      },
      {
        type: "input",
        block_id: "feedback_other",
        label: {
          type: "plain_text",
          text: "Anything else you would like to share?",
          emoji: true
        },
        element: {
          type: "plain_text_input",
          action_id: "feedback_other_ml",
          multiline: true
        },
        optional: true
      }
    ]
  };
};

module.exports = {
    feedbackView
};
