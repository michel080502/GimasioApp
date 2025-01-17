

const AsistenciasMembresia = () => {
    const asistencias = [
        {
          id: 1,
          foto: "/assets/cliente1.jpg",
          nombre: "Juan Pérez",
          telefono: "123-456-7890",
          hora: "08:30 AM",
        },
        {
          id: 2,
          foto: "/assets/cliente2.jpg",
          nombre: "Ana Gómez",
          telefono: "987-654-3210",
          hora: "09:15 AM",
        },
        {
          id: 3,
          foto: "/assets/cliente3.jpg",
          nombre: "Carlos López",
          telefono: "555-123-4567",
          hora: "10:00 AM",
        },
      ];
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
    <div>
      <h1 className="font-medium text-xl p-2">Asistencias con membresia</h1>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
        <thead className="bg-gray-100 text-xs ">
          <tr className="text-center">
            <th className="px-3 py-2 text-gray-700 uppercase">#</th>
            <th className="px-3 py-2 text-gray-700 uppercase">Foto cliente</th>
            <th className="px-3 py-2 text-gray-700 uppercase">Nombre cliente</th>
            <th className="px-3 py-2 text-gray-700 uppercase">Telefono</th>
            <th className="px-3 py-2 text-gray-700 uppercase">Hora</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
        {asistencias.map((asistencia) => (
          <tr key={asistencia.id} className="hover:bg-gray-100 ">
            <td className="px-3 py-2 text-sm  text-gray-700">
              <p>1</p>
            </td>
            <td className="px-3 py-2 text-sm text-gray-700">
                    <img
                      className="w-12 rounded-full ring-2 ring-red-800 m-auto"
                      src="/assets/proteina.jpg"
                      alt={"persona"}
                    />
                  </td>
            <td className="px-3 py-4 text-sm  text-gray-700">
              <p>{asistencia.nombre}</p>
            </td>
            <td className="px-3 py-4 text-sm  text-gray-700">
              <p>{asistencia.telefono}</p>
            </td>
            <td className="px-3 py-4 text-sm  text-gray-700">
              <p>{asistencia.hora}</p>
            </td>
            {/* <td className="px-3 py-2 text-sm  text-gray-700">
              <button className="bg-gray-700 text-white rounded-lg hover:bg-black p-2 transform duration-300">Ver membresia</button>
            </td> */}
          </tr>))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AsistenciasMembresia
