const { App, ExpressReceiver, LogLevel } = require("@slack/bolt");

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } = require("./config");

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET
});

module.exports = {
  receiver,
  app: new App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG,
    receiver: receiver
  })
};
