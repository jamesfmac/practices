const sendDM = async (app, email, text, blocks) => {
  try {
    const user = await app.client.users.lookupByEmail({
        email: email
      });

    app.client.chat.postMessage({
      // The token you used to initialize your app is stored in the `context` object
      as_user: true,
      channel: user.user.id,
      text: "6 practices need updating",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Yee haaa!.`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",

              text: {
                type: "plain_text",
                text: "Update Practices"
              },
              url:
                "https://airtable.com/tblU7zcWqsp1zZOJU/viw2PpDAliaSVYFu7?blocks=hide",
              action_id: "view_practices"
            }
          ]
        }
      ]
    });
  } catch (error) {}
};

module.exports = {
  sendDM
};
