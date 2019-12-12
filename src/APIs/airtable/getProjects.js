const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async email => {
  try {
    const emailFilter = email
      ? `{TEAM_LEAD_EMAIL}="${email}"`
      : `{TEAM_LEAD_EMAIL}!=""`;


    console.log(emailFilter);

    const appliedPractices = base("Projects");
    return appliedPractices
      .select({
        filterByFormula: emailFilter
      })
      .all()
      .then(records => records)
      .catch(error => {
        console.log(error);
        return error;
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
