const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async email => {
  try {
    const emailFilter = email
      ? `{Email Address}="${email}"`
      : `{Email Address}!=""`;

    const teamLeads = base("Team Leads");
    return teamLeads
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
