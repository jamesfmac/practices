module.exports = (slackUserID, appliedPracticesGroupedByProject) => {
  const actions = [
    {
      type: "image",
      image_url:
        "https://www.jetchill.com/wp-content/uploads/2017/05/blog-header-background.jpg",
      alt_text: "image1"
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
            text: "Provide Feedback ",
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
        text: "*Your Active Projects*"
      }
    }
  ];

  const activeProjecst = appliedPracticesGroupedByProject.map(project => {
    const projectTitle = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${project.project}*`
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

    return [...projectTitle].concat(...activePractices)
  });

  const combinedBlocks = [...actions]
    .concat(...activeProjectsHeading)
    .concat(...activeProjecst);

  return { blocks: combinedBlocks };
};
