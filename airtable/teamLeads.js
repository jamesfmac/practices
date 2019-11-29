const { AIRTABLE_BASE_ID } = require("../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

const getTeamLead = async userEmail => {
  try {
    const lookupFormula = `{Email Address}="${userEmail}"`;
   
    const teamLeads = base("Team Leads");
    return teamLeads
      .select({
        // Selecting the first 3 records in Grid view:
        view: "Grid view",
        filterByFormula: lookupFormula
      })
      .all()
      .then(records => {
        return records[0].fields;
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = getTeamLead;
