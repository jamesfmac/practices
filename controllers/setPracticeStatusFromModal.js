const { updatePracticesLog } = require("../APIs/airtable/practicesLog");
const { chatUpdate } = require("../APIs/slack");

const { app } = require("../boltApp");

module.exports = async ({ ack, payload, body, context, ...args }) => {
  ack();
  try {
    const botToken = context.botToken;
    const viewID = body.view.id;
    const initialView = body.view;
    const affectedBlock = payload.block_id;
    const splitInputValue = payload.selected_option.value.split("-");
    const recordID = splitInputValue[0];
    const newStatus =
      splitInputValue[1] == "completed" ? "Completed" : "Missed";

    const resultOfAirtableUpdate = await updatePracticesLog({
      id: recordID,
      fields: {
        Status: newStatus
      }
    });
    console.log("Airtable updated", resultOfAirtableUpdate);

    /*
    WIP for updating the modal after  change in  status  
    - currently removes the  accessary on succesful update

    const upDatedBlocks = initialView.blocks.map(block => {
      if (block.block_id === affectedBlock) {
          console.log(block)
        return {type: block.type, text: block.text}
      }
      return block;
    });


    const updatedView = {
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
      blocks: resultOfAirtableUpdate? upDatedBlocks : initialView.blocks
    };

    console.log(payload);

    const resultOfModalUpdate = await app.client.views
      .update({
        token: botToken,
        view_id: viewID,
        view: updatedView
      })
      .catch(error => console.log(error));

    console.log("Modal updated", resultOfModalUpdate.ok);
    */


  } catch (error) {
    console.error(error);
  }
};
