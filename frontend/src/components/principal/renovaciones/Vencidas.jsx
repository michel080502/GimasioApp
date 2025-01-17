
const Vencidas = () => {
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
      <div className="p-2">
        <h1 className="font-medium text-xl">Vencieron antes de hoy</h1>
        <p>Renueva para que tengan acceso</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
          <thead className="bg-gray-100 text-xs ">
            <tr className="text-center">
              <th className="px-5 py-2 text-gray-700 uppercase">#</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Nombre cliente</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Hora visita</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Tipo</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
            <tr key={1} className="hover:bg-gray-100 ">
              <td className="px-6 py-4 text-sm  text-gray-700">
                <p>1</p>
              </td>

              <td className="px-6 py-4 text-sm  text-gray-700">
                <p>Basica</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vencidas
