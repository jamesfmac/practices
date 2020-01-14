const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");

const { viewsPublish, usersInfo } = require("../APIs/slack");
const { home } = require("../views");
const {
  getAppliedPractices,
  getProjects,
  getPracticesLog
} = require("../APIs/airtable");

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
    } else if (percentage < 0.85) {
      return "Ok Practices";
    } else if (percentage < 1.0) {
      return "Great Practices";
    } else {
      return "No practices";
    }
  };

  const mapPercentageToIcon = percentage => {
    if (percentage < 0.4) {
      return "frowning-emoticon-square-face.png";
    } else if (percentage < 0.6) {
      return "neutral-emoticon-square-face.png";
    } else if (percentage < 0.85) {
      return "smiling-emoticon-square-face.png";
    } else if (percentage < 1.0) {
      return "big-smile-emoticon-square-face.png";
    }
  };

  //get the data

  const today = moment().tz(TIMEZONE);
  const tomorrow = today
    .clone()
    .add(1, "day")
    .format("YYYY-MM-DD");

  const oneYearAgo = today
    .clone()
    .subtract(1, "year")
    .format("YYYY-MM-DD");

  const startOfWeek = today.clone().startOf("isoWeek");
  const endOfWeek = today.clone().endOf("isoWeek");
  const startOfPreviousWeek = startOfWeek.clone().subtract(1, "week");
  const endOfPreviousWeek = endOfWeek.clone().subtract(1, "week");

  const slackUserInfo = await usersInfo(slackUserID);
  const userEmail = slackUserInfo.profile.email;
  const appliedPractices = await getAppliedPractices(userEmail);
  const projects = await getProjects(userEmail);

  const allPractices = await getPracticesLog({
    email: userEmail,
    afterDate: oneYearAgo,
    beforeDate: tomorrow
  });

  function calcPerformanceStats(
    project,
    practices,
    startDate = oneYearAgo,
    endDate = today
  ) {
    const completedPractices = practices.filter(practice => {
      return (
        practice.fields.PROJECT_NAME == project &&
        practice.fields.Status == "Completed" &&
        moment(practice.fields.Date).isBetween(startDate, endDate, "day", "[)")
      );
    });

    const totalPractices = practices.filter(practice => {
      return (
        practice.fields.PROJECT_NAME == project &&
        moment(practice.fields.Date).isBetween(startDate, endDate, "day", "[)")
      );
    });
    return completedPractices.length / totalPractices.length;
  }

  const pendingPractices = allPractices.filter(
    practice => practice.fields.Status == "Pending"
  );

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

  const formattedProjects = await projects.map(record => {
    //define good/bad practice brackets here use a case statement probably

    const formatNumberToPercentageString = number => {
      //if number return as percentage, otherwise return as N/A
      if (isNaN(number)) {
        return "N/A";
      } else {
        return number.toLocaleString(undefined, {
          style: "percent"
        });
      }
    };

    const overallPeformanceScore = calcPerformanceStats(
      record.fields.Name,
      allPractices
    );

    const currentWeeksPerformanceScore = calcPerformanceStats(
      record.fields.Name,
      allPractices,
      startOfWeek
    );
    const previousWeeksPerformanceScore = calcPerformanceStats(
      record.fields.Name,
      allPractices,
      startOfPreviousWeek,
      endOfPreviousWeek
    );

    console.log(previousWeeksPerformanceScore);

    const performanceLevel = mapPercentageToPerformanceLevel(
      overallPeformanceScore
    );
    const performanceIcon = mapPercentageToIcon(overallPeformanceScore);

    return {
      id: record.id,
      name: record.fields.Name,
      completed: record.fields.COMPLETED,
      overdue: record.fields.OVERDUE,
      missed: record.fields.MISSED,
      percentage: formatNumberToPercentageString(overallPeformanceScore),
      performanceLevel: performanceLevel,
      performanceIcon: performanceIcon,
      currentWeekPeformance: {
        performance: formatNumberToPercentageString(
          currentWeeksPerformanceScore
        ),
        weekStartDate: startOfWeek,
        weekEndDate: endOfWeek
      },
      previousWeekPeformance: {
        performance: formatNumberToPercentageString(
          previousWeeksPerformanceScore
        ),
        weekStartDate: startOfPreviousWeek,
        weekEndDate: endOfPreviousWeek
      }
    };
  });

  const appliedPracticesGroupedByProject = groupPracticesByField(
    formattedAppliedPractices,
    "project"
  );

  const view = await home(
    slackUserID,
    appliedPracticesGroupedByProject,
    formattedProjects,
    pendingPractices
  );

  viewsPublish({
    token: token,
    user_id: slackUserID,
    blocks: view.blocks
  });
};
