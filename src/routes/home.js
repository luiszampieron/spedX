module.exports = (application) => {
  application.get("/", (req, res) => {
    application.src.controllers.home.index(application, req, res);
  });

  application.post("/enviar", (req, res) => {
    console.log(req.body);

    res.redirect("/");
  });
};
