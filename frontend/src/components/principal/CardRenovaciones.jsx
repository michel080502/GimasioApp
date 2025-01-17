import { BiSolidWrench  } from "react-icons/bi";
const CardRenovaciones = () => {
  return (
	<div className="  rounded-xl bg-white p-4 shadow-lg shadow-gray-500/50">
		<div className="border-b-2 border-red-600 flex justify-between py-2">
			<div>
				<h3 className="text-xl font-bold">Proximas renovaciones</h3>
				<p>En los proximos 7 días</p>
			</div>
			<div className="text-2xl font-semibold r">
				<BiSolidWrench />
				<span className="text-3xl" >20</span>
			</div>
		</div>
		<div className="overflow-x-auto">
			<table className="min-w-full border border-gray-200 divide-y divide-gray-300">
				<thead className="bg-gray-100 text-sm">
					<tr>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Nombre
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Fecha vencimiento
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Tipo membresia
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					<tr className="hover:bg-gray-100">
						<td className="px-6 py-4 text-sm text-gray-700">Juan Pérez</td>
						<td className="px-6 py-4 text-sm font-semibold text-gray-700">Martes, 24 de Marzo</td>
						<td className="px-6 py-4 text-sm text-gray-700">Basica</td>
					</tr>
				
				</tbody>
			</table>
		</div>
	</div>

  )
}

export default CardRenovaciones