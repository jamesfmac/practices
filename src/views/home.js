module.exports = (slackUserID, appliedPracticesGroupedByProject) => {
  const actions = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Dashboard*"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "App Settings",
          emoji: true
        },
        value: "click_me_123"
      }
    },
    {
      type: "divider"
    },
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

  const activeProjectsHeading = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Active Projects*"
      }
    },
    {
      type: "divider"
    }
  ];

  const activeProjecst = appliedPracticesGroupedByProject.map(project => {
    const projectTitle = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${project.project}`
        }
      }
    ];

    const practicesContextArray = project.practices.map(practice => {
      return {
        type: "mrkdwn",
        text: `><fakelink.com|${practice.name}>\n> ${practice.schedule}`
      };
    });

    const activePractices = [
      {
        type: "context",
        elements: practicesContextArray
      }
    ];

    const divider = [
      {
        type: "divider"
      }
    ];

    return [...projectTitle].concat(...activePractices);
  });

  const combinedBlocks = [...actions]
    .concat(...activeProjectsHeading)
    .concat(...activeProjecst);

  return { blocks: combinedBlocks };
};
