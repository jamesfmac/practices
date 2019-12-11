const { viewsPublish, usersInfo } = require("../APIs/slack");
const { home } = require("../views");
const { getAppliedPractices } = require("../APIs/airtable");

module.exports = async (slackUserID, token) => {
  const groupPracticesByField = (array, field) => {
    const uniqueValuesInField = array
      .map(practice => practice[field])
      .filter((field, index, all) => all.indexOf(field) === index);

    const groupedPractices = uniqueValuesInField.map(x => {
      const practices = array.filter(practice => practice[field] === x);
      return {
        [field]: x,
        practices: practices
      };
    });
    return groupedPractices;
  };

  const slackUserInfo = await usersInfo(slackUserID);
  const userEmail = slackUserInfo.profile.email;
  const appliedPractices = await getAppliedPractices(userEmail);

  const formattedAppliedPractices = appliedPractices.map(
    record => {
      return{
        id: record.id,
        activePracticeID: record.fields.ID,
        email: record.fields.TEAM_LEAD_EMAIL[0],
        name: record.fields.PRACTICE_NAME[0],
        project: record.fields.PROJECT_NAME[0],
        schedule: record.fields._SCHEDULE[0]
      }
    }
  );

  const appliedPracticesGroupedByProject = groupPracticesByField(formattedAppliedPractices, "project")




  const view = await home(slackUserID, appliedPracticesGroupedByProject);

  viewsPublish({
    token: token,
    user_id: slackUserID,
    blocks: view.blocks
  });
};
