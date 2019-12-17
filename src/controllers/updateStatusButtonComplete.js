const { updatePracticesLog } = require("../APIs/airtable/practicesLog");
const { viewsUpdate } = require("../APIs/slack");
const refreshHome = require("./refreshHome");

module.exports = async ({ ack, body, view, context, payload }) => {
  ack();


  try {
    const botToken = context.botToken;
    const viewID = body.view.id;
    const slackUserID = body.user.id;
    const initialView = body.view;
    const initialBlocks = body.view.blocks;
    const affectedBlock = payload.block_id;
    const recordID = payload.value;
    const indexOfActionedPractice = initialBlocks.findIndex(
      x => x.block_id === affectedBlock
    );
    const newStatus = "Completed";

    console.log(initialView);

    const resultOfAirtableUpdate = await updatePracticesLog({
      id: recordID,
      fields: {
        Status: newStatus
      }
    });

    if (resultOfAirtableUpdate) {
      //refresh home to recalc performance stats
      refreshHome(slackUserID, botToken);

      //update the modal view if the airtable update is succesful
      const updatedBlocks = await initialView.blocks.map((block, index) => {
        if (index === indexOfActionedPractice) {
          block.elements[0].text.text = `:white_check_mark: ${newStatus}`;
          block.elements[1].text.text = `Missed`;
          return { type: block.type, elements: block.elements };
        } else if (index === indexOfActionedPractice - 1) {
          block.elements[1].text = `*Status* ${newStatus}`;
          return block;
        }
        return block;
      });

      const updatedView = {
        type: initialView.type,
        title: initialView.title,
        close: initialView.close,
        blocks: updatedBlocks
      };

      const resultOfModalUpdate = await viewsUpdate(
        botToken,
        viewID,
        updatedView
      );

      console.log("Modal updated", resultOfModalUpdate.ok);
    }

    console.log("Airtable updated", resultOfAirtableUpdate);
  } catch (error) {
    console.error(error);
  }
};
