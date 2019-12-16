const moment = require("moment-timezone");

module.exports = (data, isForModal) => {
  console.log(data.dailyPractices);

  const text = `Your practices for the week`;

  const introText = isForModal
    ? `These are your planned practices for today`
    : `Hey <@${data.slackID}> these are your planned practices for today :airplane:`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: introText
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
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Weekly Practices*`,
        verbatim: false
      }
    }
  ];

  const dayOfWeekBlock = data.week
    .filter(day => day.practices.length > 0)
    .map(day => {
      const dayHeading = [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `:calendar: ${moment(day.date).format("dddd, Do MMM")}`,
              verbatim: false
            }
          ]
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
                text: `\n>${practice.project} `,
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
          text: ":information_source: Use `/practicely` to log your practices"
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
      .concat(...dayOfWeekBlock)
      .concat(...footer)
  };
};
