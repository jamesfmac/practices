const { app } = require("../../bolt");

module.exports = view => {
  app.client.views
    .open({
      token: view.token,
      trigger_id: view.trigger_id,
      view: view.view
    })
    .catch(error => {
      console.log("views.open error", error.data);
      return error;
    });
};
