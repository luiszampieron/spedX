const fs = require("fs");
const PDFParser = require("pdf2json");

const pdfCaminho = "erros.pdf";

if (fs.existsSync(pdfCaminho)) {
  const pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", function (errData) {
    console.error(errData.parserError);
  });

  pdfParser.on("pdfParser_dataReady", function (pdfData) {
    const listEncode = [];
    const listObj = [];

    pdfData.Pages.map((page, numPage) => {
      page.Texts.map((text, numText) => {
        let line = text.R[0].T;

        if (line == "Mensagem") {
          line = "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-";
        }

        if (
          decodeURIComponent(line) == `Página ${numPage + 1} de` ||
          decodeURIComponent(line) == "633" ||
          decodeURIComponent(line) == "informado ou inválido" ||
          decodeURIComponent(line) == "SPED - EFD-CONTRIBUIÇOES - VERSÃO 5.0.1"
        ) {
          return;
        }
        if (numPage === 0) {
          if (numText > 28) {
            listEncode.push(decodeURIComponent(line));
          }
        } else if (numText >= 20) {
          listEncode.push(decodeURIComponent(line));
        }
      });
    });

    const teste = () => {
      for (let i = 0; i < listEncode.length; i += 9) {
        const obj = {};
        obj.line = listEncode[i + 1];
        obj.wrongValue = listEncode[i + 5];
        obj.expectedValue = listEncode[i + 4];
        listObj.push(obj);
      }
    };

    teste();

    console.log(listObj);
  });

  pdfParser.loadPDF(pdfCaminho);
  console.log("Arquivo localizado");
} else {
  console.log("Arquivo não localizado");
}
