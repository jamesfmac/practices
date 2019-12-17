module.exports = async userSettings => {
  const sendDailyReminders = userSettings.sendDailyReminders;
  const sendDailyPlan = userSettings.sendDailyPlan

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

  const optionNeverRemind = {
    text: {
      type: "plain_text",
      text: "Don't remind me",
      emoji: true
    },
    value: "Never"
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
        block_id: "send-plan-input",
        label: {
          type: "plain_text",
          text: "Planned practices reminder",
          emoji: true
        },
        hint: {
          type: "plain_text",
          text:
            "Playbook pilot can message you each morning with any practices planned for the day",
          emoji: true
        },
        element: {
          type: "static_select",
          action_id: "send-plan-select",

          initial_option: sendDailyPlan
            ? optionDailyReminders
            : optionNeverRemind,

          options: [optionDailyReminders, optionNeverRemind]
        }
      },
      {
        type: "input",
        block_id: "send-reminder-input",
        label: {
          type: "plain_text",
          text: "Overdue practices reminder",
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
