module.exports = (data, body) => {
  const text = `These are your practices for the week`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "These are your practices for the week",
        verbatim: false
      }
    }
  ];

  const dailyPracticesBlock = data.dailyPractices.map(practice => {
    const projectList = practice.projects.join(" | ");

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${practice.practice}*`,
          verbatim: false
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:file_folder: *Projects*: ${projectList}`,
            verbatim: false
          }
        ]
      },
      {
        type: "divider"
      }
    ];
  });

  const dayOfWeekBlock = data.week.map(day => {
    const dayHeading = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${day.date}*`,
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
            text: `${practice.practice}`,
            verbatim: false
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `:file_folder: *Project*: ${practice.project}`,
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
          text: "N/A",
          verbatim: false
        }
      }
    ];

    const dayBody =
      dayOfWeekPractices.length > 0 ? dayOfWeekPractices : altBody;

    return [...dayHeading].concat(...dayBody);
  });

  const blocks = [...introBlock]
    .concat(...dailyPracticesBlock)
    .concat(...dayOfWeekBlock);

  return { text: text, blocks: blocks };
};
