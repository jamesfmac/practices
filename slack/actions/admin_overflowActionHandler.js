
const { generatePractices } = require("../../methods");

const admin_overflowActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload,
  say
}) => {
  try {
    ack();
    const selectedMenuOption = action.selected_option.value;
    switch (selectedMenuOption) {
      case "create_practices":
        generatePractices();
        break;
      case "show_stats":
        say("Whoops you caught me before I was ready. Stats are coming soon.");
        break;
      default:
        return;
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = admin_overflowActionHandler;
