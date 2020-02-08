const { URL_ROOT } = require("../../config");
const moment = require("moment-timezone");
module.exports = async (
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
        text: "*Playbook Scorecard*"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Settings",
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
          text: `*${project.name}*\n\`${project.playbook}\``
        }
      },
      
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `- *Total Score ${project.percentage}* _(${project.performanceLevel})_`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `- ${project.currentWeekPeformance.weekStartDate.format(
              "Do MMM"
            )} - Today:  ${project.currentWeekPeformance.performance}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `- ${project.previousWeekPeformance.weekStartDate.format(
              "Do MMM"
            )} - ${project.previousWeekPeformance.weekEndDate.format(
              "Do MMM"
            )}:  ${project.previousWeekPeformance.performance}`
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
        text: "*Active Projects*"
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
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Edit Project",
            emoji: true
          },
          action_id: "showProjectSettingsModal",
          value: `${project.project}`
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
    return [...projectTitle].concat(...activePractices);
  });

  const combinedBlocks = []
    .concat(...heading)
    .concat(...projectStats)
    .concat(...overduePracticesNoticeSM)
    .concat(...actions)
    .concat(...activeProjectsHeading)
    .concat(...activeProjects);

  return { blocks: combinedBlocks };
};
