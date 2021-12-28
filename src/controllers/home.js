const fs = require("fs");

module.exports.index = function (application, req, res) {
  res.render("home/index");
};

module.exports.upload = function (application, req, res) {
  if (req.files === null) {
    res.render("home/index");
  } else {
    const mainAsync = async () => {
      const value = await application.src.services.corretor.corretor(
        req.files.fileError.tempFilePath,
        req.files.fileFiscal.tempFilePath
      );

      fs.writeFile(`FIXED_${req.files.fileFiscal.name}`, value, function (err) {
        if (err) {
          return console.log(err);
        } else {
          res.download(`FIXED_${req.files.fileFiscal.name}`);
          setTimeout(() => {
            fs.unlink(`FIXED_${req.files.fileFiscal.name}`, (err) => {
              if (err) throw err;
            });
          }, 2000);
        }
      });
    };

    mainAsync();
  }
};
