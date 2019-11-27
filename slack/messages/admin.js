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

  const actions = [
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "My Practices",
            emoji: true
          },
        
          action_id: "my_practices",
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
          style: "danger"
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
