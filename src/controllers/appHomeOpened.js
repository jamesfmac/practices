const refreshHome = require("./refreshHome")

module.exports = async context => {
  const slackUserID = context.event.user;
  const token = context.context.botToken;

  refreshHome(slackUserID, token)

 


 
};
