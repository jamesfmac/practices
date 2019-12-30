const moment = require("moment-timezone");

module.exports = (data, isForModal) => {

  const text = `Your practices for the week`;

  const introText = isForModal
    ? `These are your planned practices for the week`
    : `Hey <@${data.slackID}> these are your planned practices for the week.`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: introText
      }
    }
  ];

  const dailyPracticesHeading = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Every Day*",
        verbatim: false
      }
    }
  ];

  const dailyPracticesBlock = data.dailyPractices.map(practice => {
    const projectList = practice.projects.join(", ");

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${practice.name}s`,
          verbatim: false
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:ledger: *Projects:* ${projectList}`,
            verbatim: false
          }
        ]
      }
    ];
  });

  const weekHeaderBlock = [
    {
      type: "divider"
    },
  ];

  const dayOfWeekBlock = data.week
    .filter(day => day.practices.length > 0)
    .map(day => {
      const dayHeading = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${moment(day.date).format("dddd")}*`,
            verbatim: false
          }
        }
      ];

      const dayOfWeekPractices = day.practices.map(practice => {
        return [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${practice.name}`,
              verbatim: false
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:ledger: *Project:* ${practice.project} `,
                verbatim: false
              }
            ]
          }
        ];
      });

      const altBody = [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `N/A`,
              verbatim: false
            }
          ]
        }
      ];

      return [...dayHeading].concat(...dayOfWeekPractices);
    });

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
        text: `Your Week`,
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true
      },

      blocks: []

        .concat(...dailyPracticesBlock)
        .concat(...weekHeaderBlock)
        .concat(...dayOfWeekBlock)
    };
  }

  return {
    text: text,
    blocks: []
      .concat(...introBlock)
      .concat(...dailyPracticesBlock)
      .concat(...weekHeaderBlock)
      .concat(...dayOfWeekBlock)
      .concat(...footer)
  };
};
