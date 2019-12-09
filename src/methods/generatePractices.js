const { TIMEZONE, AIRTABLE_BASE_ID } = require("../../config");

const {
  insertPractices,
  getPracticesByDate
} = require("../APIs/airtable/practicesLog");

const base = require("airtable").base(AIRTABLE_BASE_ID);
const moment = require("moment-timezone");

module.exports = async () => {
  const date = moment().tz(TIMEZONE); 

  const endOfWeek = date.clone().endOf("isoWeek");

  while (endOfWeek.isAfter(date)) {
    await createPracticesForDate(date.clone());
    date.add(1, "day");
  }
};

const createPracticesForDate = async date => {
  //Set up the dates that we need to find the practices due today

  const prettyDate = date.format("dddd, Do MMM");

  const week = () => {
    return date.week() % 2 ? 2 : 1;
  };
  const dayOfWeek = date.day(date.day()).format("ddd");
  const dayOfMonth = date.format("Do");

  const dateFormattedForAirtable = date.format("YYYY-MM-DD");

  console.log(`Checking schedules for ${prettyDate} in${TIMEZONE}`);

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

  try {
    //these could be done  in parallel to speed things up

    const lookupFormula = `OR({${dayOfWeek} - W${week()}}=1, {Schedule Name}="Monthly - ${dayOfMonth}")`;

    const expectedPractices = await base("Schedules")
      .select({
        filterByFormula: lookupFormula
      })
      .all()
      .then(records => {
        return records.reduce((result, record) => {
          const activePracticeIDs = record.get("Active Practices");
          return activePracticeIDs
            ? [...result].concat(...activePracticeIDs)
            : result;
        }, []);
      });

    const existingPractices = await getPracticesByDate(
      dateFormattedForAirtable
    );

    //check project end dates
    const activeExpectedPractice = await checkForProjectEndDates(
      expectedPractices,
      date
    );

    //compare existing to expected and create the missing ones

    console.log(
      `${activeExpectedPractice.length} practices scheduled for ${prettyDate}`
    );
    console.log(
      `${existingPractices.length} practices already exist for ${prettyDate}`
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
