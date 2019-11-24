const practicesReminder = practicesGroupedByTeamLead => {
  const group = practicesGroupedByTeamLead;

  const text =
    group.practices.length > 1
      ? `${group.practices.length} new practices to update:`
      : `${group.practices.length} new practice to update:`;

  const intro = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: text
      }
    }
  ];

  const practiceCards = group.practices.map(practice => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${practice.practice}`
        }
      },

      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `Project:\n${practice.project}`
          },
          {
            type: "mrkdwn",
            text: `Date:\n${practice.date}`
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Missed",
              emoji: true
            },
            value: `${practice.id}`,
            action_id: "missed_practice"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Completed",
              emoji: true
            },
            style: "primary",
            value: `${practice.id}`,
            action_id: "completed_practice"
          }
        ]
      },
      {
        type: "divider"
      }
    ];
  });

  const blocks = [...intro].concat(...practiceCards);

  return blocks;
};

module.exports = {
  practicesReminder
};
