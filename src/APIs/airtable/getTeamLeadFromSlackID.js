const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async slackUserID => {
  try {
    const searchFilter = `{Slack User ID}="${slackUserID}"`;

    const teamLeads = base("Team Leads");
    return teamLeads
      .select({
        filterByFormula: searchFilter
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
