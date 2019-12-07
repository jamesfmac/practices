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

  const confirmObject = {
    title: {
      type: "plain_text",
      text: "Are you sure?"
    },
    text: {
      type: "mrkdwn",
      text: "This will message all team leads with asking them to update their pending practices for  today"
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
            text: "Remind All",
            emoji: true
          },
          action_id: "remind_all",
          style: "danger",
          confirm: confirmObject
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Show Help",
            emoji: true
          },
          action_id: "show_help"
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
                text: "My Weekly Plan",
                emoji: true
              },
              value: "send_weekly_plan"
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
