const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async (email, projectName) => {
  try {
    const emailFilter = email
      ? `{TEAM_LEAD_EMAIL}="${email}"`
      : `{TEAM_LEAD_EMAIL}!=""`;

    const projectNameFilter = projectName
      ? `{Name}="${projectName}"`
      : `{Name}!=""`;
      const combinedFilters = 
      projectNameFilter.concat(", ", emailFilter)


      const finalFilter = `AND(${combinedFilters})`

    const appliedPractices = base("Projects");
    return appliedPractices
      .select({
        filterByFormula: finalFilter
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
