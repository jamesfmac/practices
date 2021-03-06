const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

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
      .then(record => {
        return record;
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
        return error;
      }
      records.forEach(function(record) {
        console.log(`Created: ${record.getId()} ${record.get("Date")}`);
      });
      return "Practices Created";
    });
  });
};

const getPracticesByDate = async date => {
  const practices = base("Practices Log");
  const todaysPractices = practices.select({
    filterByFormula: `IS_SAME(Date, "${date}", "day" )`
  });

  return todaysPractices
    .all()
    .then(records => {
      return [].concat.apply(
        [],
        records.map(record => record.get("Active Practice ID"))
      );
    })
    .catch(error => {
      console.log(error);
      return error;
    });
};

module.exports = {
  updatePracticesLog,
  insertPractices,
  getPracticesByDate
};
