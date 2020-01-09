module.exports = async userSettings => {
  const getInitialOverduePracticesSetting = userSettings => {
    const overduePracticesSetting = userSettings.overduePracticesReminders;

    switch (overduePracticesSetting.toString()) {
      case "Daily":
        return optionDaily;
        break;
      case "End of Week":
        return optionEndOfWeek;
      case "Daily,End of Week":
        return optionEoWAndDaily;
      default:
        return optionNever;
    }
  };

  const getInitialPlannedPracticesSetting = userSettings => {
    const overduePracticesSetting = userSettings.plannedPracticesReminders;

    switch (overduePracticesSetting.toString()) {
      case "Daily":
        return optionDaily;
        break;
      case "Start of Week":
        return optionStartofWeek;
      case "Daily,Start of Week":
        return optionSoWAndDaily;
      default:
        return optionNever;
    }
  };

  const optionDaily = {
    text: {
      type: "plain_text",
      text: "Daily",
      emoji: true
    },
    value: "Daily"
  };
  const optionStartofWeek = {
    text: {
      type: "plain_text",
      text: "Start of Week",
      emoji: true
    },
    value: "Start of Week"
  };
  const optionEndOfWeek = {
    text: {
      type: "plain_text",
      text: "End of Week",
      emoji: true
    },
    value: "End of Week"
  };

  const optionEoWAndDaily = {
    text: {
      type: "plain_text",
      text: "End of Week + Daily",
      emoji: true
    },
    value: "EOW+Daily"
  };
  const optionSoWAndDaily = {
    text: {
      type: "plain_text",
      text: "Start of Week + Daily",
      emoji: true
    },
    value: "SOW+Daily"
  };

  const optionNever = {
    text: {
      type: "plain_text",
      text: "Never",
      emoji: true
    },
    value: "Never"
  };

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Message Settings",
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

          initial_option: getInitialPlannedPracticesSetting(userSettings),

          options: [
            optionSoWAndDaily,
            optionDaily,
            optionStartofWeek,
            optionNever
          ]
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

          initial_option: getInitialOverduePracticesSetting(userSettings),

          options: [
            optionEoWAndDaily,
            optionDaily,
            optionEndOfWeek,
            optionNever
          ]
        }
      }
    ]
  };
};
