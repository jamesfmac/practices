const { app } = require("../../bolt");

module.exports = view => {
  app.client.views
    .publish({
      token: view.token,
      user_id: view.user_id,
      view: { type: "home", blocks: view.blocks }
    })
    .catch(error => {
      console.log("views.publish", error);
      return error;
    });
};
