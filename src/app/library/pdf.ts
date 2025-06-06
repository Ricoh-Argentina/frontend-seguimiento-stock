import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { variable64 } from "../../assets/img/img";
import { QrResponse } from "../interfaces/generador-qr.interface";

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

type Product = {
  nombre: string;
  cantidad: number;
  total: number;
};

/*
const generatePDF = (
  products: Product[],
  reciboNo: string,
  fecha: string
)*/
const generatePDF = (
  data: QrResponse[],
) => {

  const content: any[] = [];

  console.log(data);

  data.forEach((element) => {
    console.log(element);

    content.push({
      columns: [
        {
          stack: [
            { image: variable64.ricohLogo, width: 85 },
            { text: `Etiqueta No. ${element.numero_secuencia}`, style: "header" },
            { text: `Fecha: ${element.fecha}`, style: "subheader" },
          ],
          alignment: "center",
        },
      ],
    });


    content.push({
      qr: element.qr,
      fit: 280,
      alignment: "center",
      margin: [0, 0, 0, 0],
    });


    content.push({ text: "\n\n\n\n" });

  });



  const styles = {
    header: {
      fontSize: 14,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: "black",
    },
    total: {
      fontSize: 12,
      bold: true,
    },
  };

  /* 1 unidad = 0,35 mm -> 228 = 80mm */
  const docDefinition: any = {
    defaultFileName: "PDF",
    info: {
      title: "PDF_QR",
      author: "Ricoh Argentina",
      subject: "PDF_Subject",
    },
    pageSize: {
      width: 428, //80 mm
      height: 428 //80 mm
    },
    //[left,top,right,bottom]
    pageMargins: [0, 30, 0, 0],
    content,
    styles,
  };

  pdfMake.createPdf(docDefinition).open();
};

export default generatePDF;
