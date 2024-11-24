import { HiSearchCircle } from "react-icons/hi";
export const CardLastAssists = () => {
  return (
	<div className=" col-span-2 rounded-xl bg-white p-4 shadow-lg shadow-gray-500/50 "> 
		<div className="border-b-2 border-red-600 grid gap-3 grid-cols-3 py-2 items-center">
			<div>
				<h3 className="text-xl font-bold">Ultimas asistencias</h3>
				<p>Registro asistencias de hoy</p>
			</div>
			<div className=" col-span-2">
				<form className="relative">
					<input
					type="text"
					placeholder="Buscar usuario..."
					className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
					/>
					<button
					type="submit"
					className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
					>
					<HiSearchCircle className="text-2xl" />
					</button>
				</form>
			</div>
		</div>
		<div className="overflow-x-auto">
			<table className="min-w-full border border-gray-200 divide-y divide-gray-300">
				<thead className="bg-gray-100 text-sm">
					<tr>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						No.
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Nombre
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Acceso por
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Hora Entrada
						</th>
						<th className="px-5 py-2 text-left  text-gray-700 uppercase">
						Tipo cliente
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					<tr className="hover:bg-gray-100">
						<td className="px-6 py-4 text-sm text-gray-700">1</td>
						<td className="px-6 py-4 text-sm font-semibold text-gray-700">Michel Gutierrez</td>
						<td className="px-6 py-4 text-sm text-gray-700">Membresia</td>
						<td className="px-6 py-4 text-sm font-semibold text-gray-700">12.30 p.m</td>
						<td className="px-6 py-4 text-sm text-gray-700">Nuevo</td>
					</tr>
					<tr className="hover:bg-gray-100">
						<td className="px-6 py-4 text-sm text-gray-700">2</td>
						<td className="px-6 py-4 text-sm font-semibold text-gray-700">Michel Gutierrez</td>
						<td className="px-6 py-4 text-sm text-gray-700">Visita</td>
						<td className="px-6 py-4 text-sm font-semibold text-gray-700">12.30 p.m</td>
						<td className="px-6 py-4 text-sm text-gray-700">Frecuente</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

  )
}
