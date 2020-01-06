const moment = require("moment-timezone");

module.exports = async practices => {
  try {
    const getListOfPracticeIDs = list => {
      return list.map(record => {
        return record.id;
      });
    };

    const groupPracticesByDate = (list, date) => {
      return (
        list
          //  filter out items not matching date
          .filter(item => {
            return item.fields.Date === date;
          })
          //  map the practice to the desired shape
          .map(record => {
            return {
              id: record.id,
              email: record.fields.TEAM_LEAD_EMAIL[0],
              practice: record.fields.PRACTICE_NAME[0],
              project: record.fields.PROJECT_NAME[0],
              date: moment(record.fields.Date).format("dddd, Do MMM"),
              status: record.fields.Status
            };
          })
      );
    };

    const getUniqueDates = list => {
      return list
        .map(item => item.fields.Date)
        .filter((date, index, all) => all.indexOf(date) === index);
    };

    const uniqueDates = getUniqueDates(practices);

    const practicesGroupedByDate = await uniqueDates.map(date => {
      return {
        date: date,
        practices: groupPracticesByDate(practices, date)
      };
    });

    const listOfPracticeIDs = await getListOfPracticeIDs(practices);

    return {
      practicesGroupedByDate: practicesGroupedByDate,
      listOfPracticeIDs: listOfPracticeIDs
    };
  } catch (error) {
    console.log(error);
  }
};
