import ExcelJS from "exceljs";

const exportToExcel = async ({ data, tableHeaders }) => {
  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");

  // Agregar encabezado con el nombre del gimnasio y fecha
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  worksheet.addRow(["Gym Spartans"]).font = { bold: true, size: 18 };
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

  // Retornar el buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

export default exportToExcel;
