// utils/exportExcel.js
import exportToExcel from "./exportToExcel";
import clienteAxios from "../config/axios";

const exportDataToExcel = async (generateExcelData, headers, fileName, type) => {
  try {
    const formattedData = generateExcelData;

    const buffer = await exportToExcel({
      data: formattedData,
      tableHeaders: headers,
    });

    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      })
      .replace(/[^\w\s]/gi, "-"); // Reemplazar caracteres no válidos

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    if(type === "download") {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}_${formattedDate}.xlsx`;
        link.click();
        return;
    } else {
        const fileName = `reporte_clientes_${formattedDate}.xlsx`;
        const formData = new FormData();
        formData.append("archivo", blob, fileName);
       
        const { data } = await clienteAxios.post("/admin/enviar-excel", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        return data.message;
    }
  } catch (error) {
    console.error("Error al generar el reporte de Excel:", error);
  }
};


export {
    exportDataToExcel }