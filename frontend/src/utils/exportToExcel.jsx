import ExcelJS from "exceljs";

const exportToExcel = async ({ fileName, gymName, data, tableHeaders }) => {
  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");

  // Agregar encabezado con el nombre del gimnasio y fecha
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  worksheet.addRow([gymName]).font = { bold: true, size: 16 };
  worksheet.addRow([`Reporte generado el: ${formattedDate}`]).font = {
    italic: true,
    size: 12,
  };
  worksheet.addRow([]);

  // Agregar encabezados de la tabla
  const headerRow = worksheet.addRow(tableHeaders);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // Agregar datos
  data.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });

  // Ajustar ancho de columnas
  tableHeaders.forEach((_, index) => {
    worksheet.getColumn(index + 1).width = 20;
  });

  // Guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}_${formattedDate}.xlsx`;
  link.click();
};

export default exportToExcel;
