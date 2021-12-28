const fs = require("fs");
const PDFParser = require("pdf2json");

module.exports.corretor = (pdfCaminho, spedCaminho) =>
  new Promise((resolve) => {
    const pdfParser = new PDFParser();
    const listEncode = [];
    const listObj = [];

    const spedString = fs.readFileSync(spedCaminho, "utf8");
    const listText = spedString.split("\r\n");

    pdfParser.on("pdfParser_dataReady", function (pdfData) {
      pdfData.Pages.map((page, numPage) => {
        page.Texts.map((text, numText) => {
          let line = decodeURIComponent(text.R[0].T);

          if (line == "Mensagem")
            line = "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-";

          if (
            line == `Página ${numPage + 1} de` ||
            line == "633" ||
            line == "informado ou inválido" ||
            line == "CST_COFINS" ||
            line == "VL_COFINS" ||
            line == "Contribuição Social." ||
            line == "SPED - EFD-CONTRIBUIÇOES - VERSÃO 5.0.1"
          )
            return;

          if (line.slice(0, 1) === "|" || line.slice(-1) === "|") return;

          if (numPage === 0) {
            if (numText > 28) {
              listEncode.push(line);
            }
          } else if (numText >= 20) {
            listEncode.push(line);
          }
        });
      });

      const objFactory = () => {
        for (let i = 0; i < listEncode.length; i += 7) {
          const obj = {};
          obj.line = listEncode[i + 1] - 1;
          obj.wrongValue =
            listEncode[i + 4].slice(-1) === "0"
              ? listEncode[i + 4].slice(0, 3)
              : listEncode[i + 4];
          obj.expectedValue =
            listEncode[i + 3] === "Registro/Campo não"
              ? " "
              : listEncode[i + 3];
          listObj.push(obj);
        }
      };

      objFactory();

      listObj.forEach((item) => {
        listText[item.line] = listText[item.line].replace(
          item.wrongValue,
          item.expectedValue
        );
      });

      fs.unlink(pdfCaminho, (err) => {
        if (err) throw err;
      });
      fs.unlink(spedCaminho, (err) => {
        if (err) throw err;
      });

      resolve(listText.join("\r\n"));
    });

    pdfParser.loadPDF(pdfCaminho);
  });
