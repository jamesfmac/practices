const { viewsPublish, usersInfo } = require("../APIs/slack");
const { home } = require("../views");
const { getAppliedPractices, getProjects } = require("../APIs/airtable");

module.exports = async (slackUserID, token) => {
  //helper functions
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

  const mapPercentageToPerformanceLevel = percentage => {
    if (percentage < 0.1) {
      return "Minimal Practices";
    } else if (percentage < 0.4) {
      return "Poor Practices";
    } else if (percentage < 0.6) {
      return "Some Practices";
    } else if (percentage < 0.8) {
      return "Ok Practices";
    } else if (percentage < 0.95) {
      return "Great Practices";
    }
    else{
      return "No practices"
    }
  };

  //get the data
  const slackUserInfo = await usersInfo(slackUserID);
  const userEmail = slackUserInfo.profile.email;
  const appliedPractices = await getAppliedPractices(userEmail);
  const projects = await getProjects(userEmail);

  const formattedAppliedPractices = appliedPractices.map(record => {
    return {
      id: record.id,
      activePracticeID: record.fields.ID,
      email: record.fields.TEAM_LEAD_EMAIL[0],
      name: record.fields.PRACTICE_NAME[0],
      project: record.fields.PROJECT_NAME[0],
      schedule: record.fields._SCHEDULE[0]
    };
  });

  const formattedProjects = await projects.map( record => {
    //define good/bad practice brackets here use a case statement probably
    const percentage = record.fields.PERCENTAGE_PRACTICES_COMPLETE;
    const percentageString = percentage.toLocaleString( undefined, {
      style: "percent"
    });

    const performanceLevel = mapPercentageToPerformanceLevel(percentage)

   
    return {
      id: record.id,
      name: record.fields.Name,
      completed: record.fields.COMPLETED,
      overdue: record.fields.OVERDUE,
      missed: record.fields.MISSED,
      percentage: percentageString,
      performanceLevel: performanceLevel
     
    };
  });

  const appliedPracticesGroupedByProject = groupPracticesByField(
    formattedAppliedPractices,
    "project"
  );



  const view = await home(
    slackUserID,
    appliedPracticesGroupedByProject,
    formattedProjects
  );

  viewsPublish({
    token: token,
    user_id: slackUserID,
    blocks: view.blocks
  });
};