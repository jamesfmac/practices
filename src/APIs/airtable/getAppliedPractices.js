const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async (email, project) => {
  try {
    const emailFilter = email
      ? `{TEAM_LEAD_EMAIL}="${email}"`
      : `{TEAM_LEAD_EMAIL}!=""`;

    const projectFilter = project
      ? `{PROJECT_NAME}="${project}"`
      : `{PROJECT_NAME}!=""`;

    const combinedFilter = `AND({Practice Active?}="Active" , ${emailFilter}, ${projectFilter})`;



    const appliedPractices = base("Applied Practices");
    return appliedPractices
      .select({
        filterByFormula: combinedFilter
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
