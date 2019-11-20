const { AIRTABLE_API_KEY } = require("../config");
const base = require("airtable").base("appQHyg8VRIOEuor7");

// helper function to chunk an array
const chunk = (array, size) => {
  if (!array) return [];
  const firstChunk = array.slice(0, size); // create the first chunk of the given array
  if (!firstChunk.length) {
    return array; // this is the base case to terminal the recursive
  }
  return [firstChunk].concat(chunk(array.slice(size, array.length), size));
};

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

//insert practices
const insertPractices = (practicesToApply, date) => {
  const chunkedPracticesToCreate = chunk(practicesToApply, 10);

  //take each chunk, create an array of objects and insert
  chunkedPracticesToCreate.forEach(arrayOfPractices => {
    const newPracticeInstances = arrayOfPractices.map(activepracticeID => {
      return {
        fields: {
          "Active Practice ID": [activepracticeID],
          Date: date,
          Status: "Pending"
        }
      };
    });

    base("Practices Log").create(newPracticeInstances, function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        console.log(`Created: ${record.getId()} ${record.get("Date")}`);
      });
    });
  });
};

const getPracticesByDate = async date => {
  const practices = base("Practices Log");
  const todaysPractices = practices.select({
    view: "All Logged Practices",
    filterByFormula: `IS_SAME(Date, "${date}", "day" )`
  });
  return todaysPractices.firstPage().then(records => {
    return [].concat.apply(
      [],
      records.map(record => record.get("Active Practice ID"))
    );
  });
};

module.exports = {
  updatePracticesLog,
  insertPractices,
  getPracticesByDate
};
