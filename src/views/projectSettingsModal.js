module.exports = async args => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Project Settings",
      emoji: true
    },
    callback_id: "submitAppSettingsModal",
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
        type: "input",
        label: {
          type: "plain_text",
          text: "Active Playbook",
          emoji: true
        },
        element: {
          type: "static_select",
          action_id: "active-playbook-select",
          placeholder: {
            type: "plain_text",
            text: "Delivery - Complex Scrum",
            emoji: true
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "Weekly - Monday",
                emoji: true
              },
              value: "value-0"
            }
          ]
        }
      },
      {
        type: "input",
        element: {
          type: "datepicker",
          initial_date: "1990-04-28",
          action_id: "project-end-date-select",
          placeholder: {
            type: "plain_text",
            text: "Select a date",
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Project End Date",
          emoji: true
        }
      }
    ]
  };
};
