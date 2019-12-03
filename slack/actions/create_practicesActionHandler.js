const { generatePractices } = require("../../methods");

const my_practicesActionHandler = async ({
  body,
  ack,
  say
}) => {
  ack();

  result = generatePractices();
  say(result);
  try {
  } catch (error) {
    console.log(error);
  }
};
module.exports = my_practicesActionHandler;
