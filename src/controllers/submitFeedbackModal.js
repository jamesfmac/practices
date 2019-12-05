const { insertFeedback } = require("../APIs/airtable");

module.exports = async ({ ack, body, view, context }) => {
  ack();

  try {
    const improvementResponse =
      view["state"]["values"]["feedback_improvment"]["feedback_improvment_ml"];
    const otherResponse =
      view["state"]["values"]["feedback_other"]["feedback_other_ml"];

    insertFeedback(
      body.user.username,
      improvementResponse.value,
      otherResponse.value
    );
  } catch (error) {
    console.log(error);
  }
};
