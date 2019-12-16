const moment = require("moment-timezone");

module.exports = async (slackUserID, practices, isForModal) => {
  const text = `Your practices for the week`;

  const introText = isForModal
    ? `These are your planned practices for today`
    : `Hey <@${slackUserID}> these are your planned practices for today :airplane:`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: introText
      }
    }
  ];

  const dailyPracticesBlock = practices.map(practice => {
    const projectList = practice.projects.join(", ");

    const practicetDisplayName =
      practice.projects.length > 1 ? `${practice.name}s` : `${practice.name}`;

    const projectsListPrefix =
      practice.projects.length > 1 ? `*Projects:*` : `*Project:*`;

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: practicetDisplayName
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:ledger: ${projectsListPrefix} ${projectList}`,
            verbatim: false
          }
        ]
      }
    ];
  });

  const altBody = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `You do now have any practices planned for today`
      }
    },
  ];

  const footer = [
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: ":information_source: Use `/pbp` to log your practices"
        }
      ]
    }
  ];

  if (isForModal) {
    return {
      type: "modal",
      title: {
        type: "plain_text",
        text: `Todays Practices`,
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true
      },

      blocks: [].concat(...dailyPracticesBlock)
    };
  }

  return {
    text: text,
    blocks: [].concat(...introBlock).concat(...dailyPracticesBlock)
  };
};
