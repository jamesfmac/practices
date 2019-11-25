const practicesReminderAlt = practicesGroupedByTeamLead => {
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
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:ledger: *Project:* ${practice.project}  :calendar:  *Due:* ${practice.date}`
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

  const feedback = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "We :heart: feedback! Help us make practicely better for you! :point_right: :point_right:"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Provide Feedback ",
          emoji: true
        },
        action_id: "open_feedback_form",
        value: "feedback"
      }
    }
  ];

  const blocks = [...intro].concat(...practiceCards).concat(...feedback);

  return { text: text, blocks: blocks };
};

module.exports = {
  practicesReminderAlt
};
