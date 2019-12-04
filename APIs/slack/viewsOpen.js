const { app } = require("../../boltApp");

module.exports = (view) => {
  app.client.views
    .open({
      token: view.token,
      trigger_id: view.trigger_id,
      view: view.view
    })
    .catch(error => console.log(error));
};
