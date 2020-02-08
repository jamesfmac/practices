module.exports = async args => {
  const playbookOptions = args.availiblePlaybooks.map(playbook => {
    return {
      text: {
        type: "plain_text",
        text: playbook,
        emoji: true
      },
      value: playbook
    };
  });
  const scheduleOptions = args.availibleSchedules.map(schedule => {
    return {
      text: {
        type: "plain_text",
        text: schedule,
        emoji: true
      },
      value: schedule
    };
  });

  const projectSettingsBlocks = [
    {
      type: "input",
      block_id: "active-playbook-input",
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
        initial_option: {
          text: {
            type: "plain_text",
            text: args.projectSettings[0].activePlaybook,
            emoji: true
          },
          value: args.projectSettings[0].activePlaybook
        },
        options: playbookOptions
      }
    },
    {
      type: "input",
      block_id: "project-end-date-input",
      element: {
        type: "datepicker",
        initial_date: args.projectSettings[0].endDate,
        action_id: "project-end-date-select",
        placeholder: {
          type: "plain_text",
          text: "Select a date",
          emoji: true
        }
      },
      label: {
        type: "plain_text",
        text: "Forecast End Date",
        emoji: true
      }
    }
  ];

  const activePlaysHeader = [
    {
      type: "divider"
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Schedules*\n Request new schedules for your active plays. "
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `:information_source: Today is ${args.date.day} Week ${args.date.week}`
        }
      ]
    }
  ];

  const activePlaysBlocks = args.activePlays.map(play => {
    return {
      type: "input",
      block_id: `input - ${play.name}`,
      label: {
        type: "plain_text",
        text: play.name,
        emoji: true
      },
      element: {
        type: "static_select",
        action_id: `select - ${play.name}`,

        initial_option: {
          text: {
            type: "plain_text",
            text: play.schedule,
            emoji: true
          },
          value: play.schedule
        },
        options: scheduleOptions
      }
    };
  });

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Project Settings",
      emoji: true
    },
    callback_id: "submitProjectSettingsModal",
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
    private_metadata: `${args.project}`,

    blocks: []
      .concat(...projectSettingsBlocks)
      .concat(...activePlaysHeader)
      .concat(...activePlaysBlocks)
  };
};
