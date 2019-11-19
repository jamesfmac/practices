const { AIRTABLE_API_KEY } = require("../config");
const base = require("airtable").base("appQHyg8VRIOEuor7");

const updatePracticesLog = async updates => {
  try {
    return base("Practices Log")
      .update([updates])
      .then(records => {
        return true;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  updatePracticesLog
};
