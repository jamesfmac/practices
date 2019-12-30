const Analytics = require("analytics-node");
const { SEGMENT_WRITE_KEY, LOG_LEVEL } = require("../../../config");

module.exports =  new Analytics(SEGMENT_WRITE_KEY, {
  flushAt: 1
});

