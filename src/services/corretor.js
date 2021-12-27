const fs = require("fs");
const PDFParser = require("pdf2json");

module.exports = (pdfCaminho, spedCaminho) => {
  const listEncode = [];
  const listObj = [];

  const pathSped = path.join(__dirname, spedCaminho);
  const pathPDF = path.join(__dirname, pdfCaminho);

  console.log("pathSped: ", pathSped);
  console.log("pathPdf: ", pathPDF);

  const spedString = fs.readFileSync(pathSped, "utf8");
  const listText = spedString.split("\r\n");

  let _window = window;
  window = undefined;
  if (fs.existsSync(pathPDF)) {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", function (errData) {
      console.error(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", function (pdfData) {
      pdfData.Pages.map((page, numPage) => {
        page.Texts.map((text, numText) => {
          let line = decodeURIComponent(text.R[0].T);

          if (line == "Mensagem") {
            line = "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-";
          }

          if (
            line == `Página ${numPage + 1} de` ||
            line == "633" ||
            line == "informado ou inválido" ||
            line == "CST_COFINS" ||
            line == "VL_COFINS" ||
            line == "Contribuição Social." ||
            line == "SPED - EFD-CONTRIBUIÇOES - VERSÃO 5.0.1"
          ) {
            return;
          }

          if (line.slice(0, 1) === "|" || line.slice(-1) === "|") {
            return;
          }

          if (numPage === 0) {
            if (numText > 28) {
              listEncode.push(line);
            }
          } else if (numText >= 20) {
            listEncode.push(line);
          }
        });
      });

      const teste = () => {
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

      teste();

      listObj.forEach((item) => {
        listText[item.line] = listText[item.line].replace(
          item.wrongValue,
          item.expectedValue
        );
      });

      fs.writeFile("arrumado.txt", listText.join("\r\n"), function (err) {
        if (err) return console.log(err);
      });

      const test3 = [];
      const teste2 = listObj.forEach((item) =>
        test3.push(
          item.line + "------" + item.wrongValue + "------" + item.expectedValue
        )
      );

      fs.writeFile("teste.txt", test3.join("\r\n"), function (err) {
        if (err) return console.log(err);
      });
    });

    pdfParser.loadPDF(pathPDF);
    console.log("Arquivo localizado");
  } else {
    console.log("Arquivo não localizado");
  }
  window = _window;
};
