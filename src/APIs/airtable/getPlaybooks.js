const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async filter => {
  try {
    const searchFilter = filter ? filter : `{Playbook}!=""`;

    const appliedPractices = base("Playbooks");
    return appliedPractices
      .select({
        filterByFormula: searchFilter
      })
      .all()
      .catch(error => {
        console.log(error);
        return error;
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
