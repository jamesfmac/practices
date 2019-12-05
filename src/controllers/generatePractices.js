const { generatePractices } = require("../methods");

module.exports = async ({ body, ack, say }) => {
  ack();

  result = generatePractices();
  say(result);
  try {
  } catch (error) {
    console.log(error);
  }
};
