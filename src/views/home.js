const { URL_ROOT } = require("../../config");
const moment = require("moment-timezone");
module.exports = async (
  slackUserID,
  appliedPracticesGroupedByProject,
  projects,
  pendingPractices,
  selectedTab
) => {


  const pageHeading = ()=>{
    if(selectedTab == "projects"){

      return '*Projects*'
    }
    else {
      return `*Project Scorecard*`
    }

  }



  const heading = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: pageHeading()
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
    }
  ];

  const overduePracticesNoticeSM =
    pendingPractices.length > 0
      ? [
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: `:bangbang: ${pendingPractices.length} overdue plays`,
                  emoji: true
                },

                action_id: "open_practices_log",
                style: "primary"
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
            text: "Scorecard",
            emoji: true
          },

          action_id: "showScorecardTab"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Projects",
            emoji: true
          },
          value: 'projects',
          action_id: "showProjectsTab"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Schedule",
            emoji: true
          },
          action_id: "openTodaysPractices"
        }
      ]
    },
    {
      type: "divider"
    }
  ];

  const projectStats = projects.map(project => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${project.name}*`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Playbook:* ${project.playbook}`
          }
        ]
      },

      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Total Score:* ${project.percentage} (${project.performanceLevel})`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `>${project.currentWeekPeformance.weekStartDate.format(
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
            text: `> ${project.previousWeekPeformance.weekStartDate.format(
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
        text: "*Active*"
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

  if ((selectedTab == "projects")) {
    return {
      blocks: []
        .concat(...actions)
        .concat(...heading)
        .concat(...activeProjectsHeading)
        .concat(...activeProjects)
    };
  } else {
    return {
      blocks: []
        .concat(...actions)
        .concat(...heading)
        .concat(...overduePracticesNoticeSM)
        .concat(...projectStats)
    };
  }
};
