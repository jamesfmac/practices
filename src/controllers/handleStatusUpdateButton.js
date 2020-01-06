const { updatePracticesLog } = require("../APIs/airtable/practicesLog");
const { getPracticesLog } = require("../APIs/airtable");
const { viewsUpdate } = require("../APIs/slack");
const { logPracticesModal } = require("../views");
const analytics = require("../APIs/segment");
const refreshHome = require("./refreshHome");
const formatPracticesForLogPracticesModal = require("./formatPracticesForLogPracticesModal");

module.exports = async ({ ack, body, context, payload }) => {
  ack();
  try {
    const payloadValue = payload.value.split("-")
    const botToken = context.botToken;
    const viewID = body.view.id;
    const slackUserID = body.user.id;
    const recordID = payloadValue[0];
    const private_metadata = body.view.private_metadata;

    const updatedPracticeStatus = payloadValue[1]

    console.log(updatedPracticeStatus)

    const resultOfAirtableUpdate = await updatePracticesLog({
      id: recordID,
      fields: {
        Status: updatedPracticeStatus
      }
    });

    console.log(resultOfAirtableUpdate)

    if (resultOfAirtableUpdate) {
      //refresh home to recalc performance stats
      refreshHome(slackUserID, botToken);
      //track event
      analytics.track({
        userId: slackUserID,
        event: `Practice ${updatedPracticeStatus}`,
        properties: {
          name: resultOfAirtableUpdate[0].fields.PRACTICE_NAME[0],
          date: resultOfAirtableUpdate[0].fields.Date,
          project: resultOfAirtableUpdate[0].fields.PROJECT_NAME[0],
          location: "update practices modal"
        }
      });

      //fetch the update task list from airtable
      const arrOfRecordIds = private_metadata.split(",").map(id => {
        return `RECORD_ID = "${id}"`;
      });
      const filter = `OR(${arrOfRecordIds})`;
      const records = await getPracticesLog({
        customFilter: filter,
        sort: [{ field: "Date", direction: "desc" }]
      });

      const formattedPractices = await formatPracticesForLogPracticesModal(
        records
      );

      const view = await logPracticesModal(
        formattedPractices.practicesGroupedByDate,
        formattedPractices.listOfPracticeIDs
      );

      const resultOfModalUpdate = await viewsUpdate(botToken, viewID, view);
    }

    console.log("Airtable updated", resultOfAirtableUpdate[0].id);
  } catch (error) {
    console.error(error);
  }
};
