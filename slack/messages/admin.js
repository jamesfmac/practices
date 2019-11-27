const admin = async body => {
  

  const text = `Hey <@${body.user_id}> here are your admin powers`;

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
          value: "my_practices",
          style: "primary"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":speaking_head_in_silhouette: Remind All",
            emoji: true
          },
          value: "create_practices",
          style: "danger"
        },
        {
            type: "button",
            text: {
              type: "plain_text",
              text: "Show Help",
              emoji: true
            },
            value: "check_status"
          },
        {
          type: "overflow",
          options: [
            {
              text: {
                type: "plain_text",
                text: "Generate Practices",
                emoji: true
              },
              value: "generate_practices"
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
