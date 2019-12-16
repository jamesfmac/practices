module.exports = async userSettings => {
  const sendDailyReminders = userSettings.sendDailyReminders;

  const optionDailyReminders = {
    text: {
      type: "plain_text",
      text: "Daily",
      emoji: true
    },
    value: "Daily"
  };

  const optionWeeklyReminders = {
    text: {
      type: "plain_text",
      text: "Weekly",
      emoji: true
    },
    value: "Weekly"
  };

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "App Settings",
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
    private_metadata: `${userSettings.id}`, 
    blocks: [
      {
        type: "input",
        block_id: "send-reminder-input",
        label: {
          type: "plain_text",
          text: "Overdue Practices reminder",
          emoji: true
        },
        hint: {
          type: "plain_text",
          text:
            "Hint: You can always see your pending practices on the Playbook Pilot home tab",
          emoji: true
        },
        element: {
          type: "static_select",
          action_id: "send-reminder-select",
    
          initial_option: sendDailyReminders
            ? optionDailyReminders
            : optionWeeklyReminders,

          options: [optionDailyReminders, optionWeeklyReminders]
        }
      }
    ]
  };
};
