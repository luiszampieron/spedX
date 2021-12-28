module.exports = (application) => {
  application.get("/", (req, res) => {
    application.src.controllers.home.index(application, req, res);
  });

  application.post("/", (req, res) => {
    application.src.controllers.home.upload(application, req, res);
  });
};
