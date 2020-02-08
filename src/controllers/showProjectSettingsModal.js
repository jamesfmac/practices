const { TIMEZONE } = require("../../config");
const { projectSettingsModal } = require("../views");
const { viewsOpen } = require("../APIs/slack");
const moment = require("moment-timezone");
const {
  getPlaybooks,
  getProjects,
  getAppliedPractices,
  getSchedules
} = require("../APIs/airtable");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack, payload }) => {
  try {
    ack();
    //extract data from Slack call

    const today = moment().tz(TIMEZONE);
    const location = body.view ? body.view.type : body.channel.name;
    const projectName = payload.value;

    // Get the data we need from airtable
    [playbooks, schedules, project, appliedPractices] = await Promise.all([
      getPlaybooks(),
      getSchedules(),
      getProjects(null, projectName),
      getAppliedPractices(null, projectName)
    ]);

    //Transform the data to then pass it to the view

    const dateObj = {
      day: today.clone().format("dddd"),
      week: (today.clone().week() % 2) + 1
    };
    const projectSettings = project.map(item => {
      return {
        name: item.fields.Name,
        endDate: item.fields["End Date"],
        activePlaybook: item.fields["PLAYBOOK"][0]
      };
    });

    const activePlays = appliedPractices.map(item => {
      return {
        name: item.fields.PRACTICE_NAME[0],
        schedule: item.fields._SCHEDULE[0]
      };
    });

    const availiblePlaybooks = playbooks
      .sort((a, b) => {
        if (a.fields.Playbook > b.fields.Playbook) {
          return -1;
        }
        if (a.fields.Playbook < b.fields.Playbook) {
          return 1;
        }
        return 0;
      })
      .map(item => item.fields.Playbook);

    const availibleSchedules = schedules
      .sort((a, b) => {
        if (a.fields["Sort ID"] > b.fields["Sort ID"]) {
          return 1;
        }
        if (a.fields["Sort ID"] < b.fields["Sort ID"]) {
          return -1;
        }
        return 0;
      })
      .map(item => {
        return item.fields["Schedule Name"];
      });

    const view = await projectSettingsModal({
      project: projectName,
      projectSettings: projectSettings,
      activePlays: activePlays,
      availiblePlaybooks: availiblePlaybooks,
      availibleSchedules: availibleSchedules,
      date: dateObj
    });

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
