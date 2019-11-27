const feedbackView = async body => {
 
  return  {
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
          text: `:wave: Hey <@${body.user.username}>!\n\nPracticely is in early alpha and every little bit of feedback is amazing! :star-struck:`,
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
          text: "What is the biggest problem with Practicely?",
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
          text: "Anything else you would like to see changed?",
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
