const { App, LogLevel } = require("@slack/bolt");

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } = require("./config");

module.exports = {
  app: new App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    logLevel: LogLevel.INFO
  })
};
