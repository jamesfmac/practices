const admin = async body => {
  const text = `Hey <@${body.user_id}> here are your admin powers :zap:`;

  const intro = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: text
      }
    }
  ];

  const confirmSendReminder = {
    title: {
      type: "plain_text",
      text: "Are you sure?"
    },
    text: {
      type: "mrkdwn",
      text:
        "This will message all team leads with asking them to update their pending practices for  today"
    },
    confirm: {
      type: "plain_text",
      text: "Do it"
    },
    deny: {
      type: "plain_text",
      text: "Stop, I've changed my mind!"
    }
  };

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
            text: "Send Reminders",
            emoji: true
          },
          action_id: "remind_all",
          style: "danger",
          confirm: confirmSendReminder
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
        },
        {
          type: "overflow",
          action_id: "admin_overflow",
          options: [
            {
              text: {
                type: "plain_text",
                text: "Generate Practices",
                emoji: true
              },
              value: "create_practices"
            },
            {
              text: {
                type: "plain_text",
                text: "Show Stats",
                emoji: true
              },
              value: "show_stats"
            },
            {
              text: {
                type: "plain_text",
                text: "Send Weekly Plans",
                emoji: true
              },
              value: "send_weekly_plan"
            },
            {
              text: {
                type: "plain_text",
                text: "Send Daily Plan",
                emoji: true
              },
              value: "send_daily_plan"
            }
          ]
        }
      ]
    }
  ];


 
  const blocks = [...intro].concat(...actions);

  return { text: text, blocks: blocks };
};

module.exports = admin;
