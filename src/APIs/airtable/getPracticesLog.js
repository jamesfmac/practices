module.exports = async searchCriteria => {
  //Set up the dates that we need to find the practices due today
  const { AIRTABLE_BASE_ID, TIMEZONE } = require("../../../config");

  const moment = require("moment-timezone");
  const base = require("airtable").base(AIRTABLE_BASE_ID);
  const practices = base("Practices Log");

  const {
    email,
    status,
    afterDate,
    beforeDate,
    maxRecords,
    sort
  } = searchCriteria;

  const todaysDate = moment().tz(TIMEZONE);

  //setup default values
  const defaultAfterDate = todaysDate.subtract(1, "day").format("YYYY-MM-DD");
  const defaultBeforeDate = todaysDate.add(1, "month").format("YYYY-MM-DD");
  const defaultSort = [{ field: "Practice Instance ID", direction: "desc" }];
  const defaultMaxRecords = 100;

  //create search filter
  const afterDateFilter = afterDate
    ? `IS_AFTER(Date,"${afterDate}", "day")`
    : `IS_AFTER(Date,"${defaultAfterDate}", "day")`;

  const beforeDateFilter = afterDate
    ? `IS_BEFORE(Date,"${beforeDate}", "day")`
    : `IS_BEFORE(Date,"${defaultBeforeDate}", "day")`;

  const emailFilter = email
    ? `TEAM_LEAD_EMAIL="${searchCriteria.email}"`
    : `TEAM_LEAD_EMAIL=!""`;

  const statusFilter = status
    ? `Status = "${searchCriteria.status}"`
    : `Status !=""`;

  const combinedFilters = afterDateFilter
    .concat(", ", emailFilter)
    .concat(", ", beforeDateFilter)
    .concat(", ", statusFilter);

  const finalFilter = `AND(Practice!="", ${combinedFilters})`;

  const matchingPractices = await practices
    .select({
      view: "All Logged Practices",
      filterByFormula: finalFilter,
      maxRecords: maxRecords || defaultMaxRecords,
      sort: sort || defaultSort
    })
    .all()
    .then(records => {
      return [].concat.apply(
        [],
        records.map(record => {
          return {
            id: record.id,
            fields: record.fields
          };
        })
      );
    })
    .catch(error => {
      console.log(error);
      return error;
    });

  return matchingPractices;
};
