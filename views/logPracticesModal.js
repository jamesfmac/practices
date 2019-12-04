const feedbackModal = async practices => {
  blocks = [];

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Log Practices",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Close",
      emoji: true
    },
    blocks: blocks
  };
};

module.exports = feedbackModal;
