const { changeRequest } = require("../APIs/airtable");

module.exports = async ({ ack, body, view }) => {
  ack();

  try {
    const private_metadata = body.view.private_metadata;
    const values = view.state.values;
    const selectedPlaybook =
      values["active-playbook-input"]["active-playbook-select"][
        "selected_option"
      ].value;
    const selectedEndDate =
      values["project-end-date-input"]["project-end-date-select"][
        "selected_date"
      ];

    const playScheduleRequest = Object.keys(values)
      .filter(key => key.includes("input -"))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: values[key][Object.keys(values[key])[0]].selected_option.value
        };
      }, {});

    changeRequest({
      user: body.user.username,
      project: private_metadata,
      playbook: selectedPlaybook,
      endDate: selectedEndDate,
      playSchedules: JSON.stringify(playScheduleRequest)
    });
  } catch (error) {
    console.log(error);
  }
};
