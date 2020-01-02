module.exports = (
  slackUserID,
  appliedPracticesGroupedByProject,
  projects,
  pendingPractices
) => {
  const heading = [
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
          text: "Message Settings",
          emoji: true
        },
        action_id: "showAppSettingsModal"
      }
    },
    {
      type: "divider"
    }
  ];

  const overduePracticesNoticeLG =
    pendingPractices.length > 0
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `>:rotating_light: <@${slackUserID}> you have *${pendingPractices.length}* pending practices`
            }
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
              }
            ]
          }
        ]
      : [];

  const overduePracticesNoticeSM =
    pendingPractices.length > 0
      ? [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:exclamation: *${pendingPractices.length} practices overdue*`
              }
            ]
          }
        ]
      : [];

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
            text: "Todays Practices",
            emoji: true
          },
          action_id: "openTodaysPractices"
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

  const projectStats = projects.map(project => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${project.name}`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url:
              `http://37624a4a.ngrok.io/public/${project.performanceIcon}`,
            alt_text: "Location Pin Icon"
          },
          {
            type: "mrkdwn",
            text: `${project.performanceLevel} (${project.percentage})`
          }
        ]
      }
    ];
  });

  const activeProjectsHeading = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Project Settings*"
      }
    },
    {
      type: "divider"
    }
  ];

  const activeProjects = appliedPracticesGroupedByProject.map(project => {
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
        text: `>*${practice.name}*\n> ${practice.schedule}`
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

  const combinedBlocks = []
    .concat(...heading)
    .concat(...projectStats)
    .concat(...actions)
    .concat(...overduePracticesNoticeSM)
    .concat(...activeProjectsHeading)
    .concat(...activeProjects);

  return { blocks: combinedBlocks };
};
