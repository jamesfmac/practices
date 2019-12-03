const { TIMEZONE, AIRTABLE_BASE_ID } = require("../config");

const {
  insertPractices,
  getPracticesByDate
} = require("../APIs/airtable/practicesLog");

const base = require("airtable").base(AIRTABLE_BASE_ID);

const compareExpectedAgainstExisting = async (expected, existing) => {
  const finalarr = [];

  expected.forEach(x => {
    if (!existing.includes(x)) {
      finalarr.push(x);
    }
  });
  return finalarr;
};

const checkForProjectEndDates = async (expectedPractices, date) => {
  let results = [];
  for (const practice of expectedPractices) {
    const projectEndDate = await base("Applied Practices")
      .find(practice)
      .then(record => record.fields["Project End Date"]);

    if (projectEndDate) {
      if (
        date.isBefore(projectEndDate[0], "day") ||
        date.isSame(projectEndDate[0], "day")
      ) {
        results.push(practice);
      }
    }
  }
  return results;
};

const generatePractices = async () => {
  //Set up the dates that we need to find the practices due today
  const moment = require("moment-timezone");
  const date = moment().tz(TIMEZONE);

  const week = () => {
    return date.week() % 2 ? 2 : 1;
  };
  const dayOfWeek = date.day(date.day()).format("ddd");
  const dayOfMonth = date.format("Do");

  const dateFormattedForAirtable = date.format("YYYY-MM-DD");

  console.log(`Checking schedules for Timezone: ${TIMEZONE} Date: ${date}`);

  try {
    //these could be done  in parallel to speed things up
    const existingPractices = await getPracticesByDate(
      dateFormattedForAirtable
    );
    const lookupFormula = `OR({${dayOfWeek} - W${week()}}=1, {Schedule Name}="Monthly - ${dayOfMonth}")`;
    let practicesToApply = [];
    const expectedPractices = await base("Schedules")
      .select({
        view: "All Schedules",
        filterByFormula: lookupFormula
      })
      .eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
          if (record.get("Active Practices")) {
            practicesToApply = [
              ...practicesToApply,
              ...record.get("Active Practices")
            ];
          }
        });
        fetchNextPage();
      })
      .then(() => practicesToApply);

    //check project end dates
    const activeExpectedPractice = await checkForProjectEndDates(
      expectedPractices,
      date
    );

    //compare existing to expected and create the missing ones

    console.log(
      `${activeExpectedPractice.length} practices scheduled for today`
    );
    console.log(
      `${existingPractices.length} practices already exist for today`
    );

    const practicesToCreate = await compareExpectedAgainstExisting(
      activeExpectedPractice,
      existingPractices
    );

    console.log(`${practicesToCreate.length} to be added`);

    const result = insertPractices(practicesToCreate, dateFormattedForAirtable);

    return result;
  } catch (error) {
    console.error(error);
  }
};
module.exports = generatePractices;
