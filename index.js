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

    pdfData.Pages.map((page, numPage) => {
      listEncode.push("-----------------------------------------------");
      page.Texts.map((text, numText) => {
        let line = text.R[0].T;

        if (line == "Mensagem") {
          line = "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-";
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

    const listDecode = listEncode.map((string) => {
      return decodeURIComponent(string);
    });

    console.log(listDecode);
  });

  pdfParser.loadPDF(pdfCaminho);
  console.log("Arquivo localizado");
} else {
  console.log("Arquivo não localizado");
}
