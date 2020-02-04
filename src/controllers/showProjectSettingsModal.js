const { projectSettingsModal } = require("../views");
const { viewsOpen } = require("../APIs/slack");
const { getTeamLeads } = require("../APIs/airtable");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack,payload }) => {
  try {
   
    ack();

    //get the data
    const location = body.view ? body.view.type : body.channel.name;
    const project = payload.value
    console.log(project)

    const view = await projectSettingsModal();

    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
    analytics.track({
      userId: context.slackUserID,
      event: "App Button Clicked",
      properties: {
        button: "Project Settings",
        location: location
      }
    });
  } catch (error) {
    console.error(error);
  }
};
