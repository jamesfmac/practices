const { app } = require("../../bolt");

//accept separate inputs
module.exports = (token, viewID, view) => {
  return app.client.views
    .update({
      token: token,
      view_id: viewID,
      view: view
    })
    .then(response => response)
    .catch(error => {
      console.error(error);
      return error;
    });
};
