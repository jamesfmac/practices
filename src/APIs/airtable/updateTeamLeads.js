const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async updatedRecords => {
  return base("Team Leads")
    .update(updatedRecords)
    .then(record => record)
    .catch(error => {
      console.log(error);
      return error;
    });
};
