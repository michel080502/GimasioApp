import { useEffect, useState } from "react"
import Alerta from "../Alerta"
import clienteAxios from "../../config/axios"
import PropTypes from  'prop-types'
const FormUpdate = ({id}) => {
	const [ cliente, setCliente ] = useState(null);
	const [ cargando, setCargando ] = useState(true);
	const [ showOptions, setShowOptions] = useState(false);
	const [ alerta, setAlerta] = useState({msg: "", error: false});
	useEffect(() =>{
		const getCliente = async () =>{
			try{
				const { data } = await clienteAxios.get(`/cliente/${id}`);
				setCliente(data);
			} catch(error) {
				console.log(error)
			}
			setCargando(false);
		}

		if(id) getCliente();
	}, [])
	const generarMatricula = () => {
		if (
			cliente.nombre &&
			cliente.apellidoPaterno &&
			cliente.apellidoMaterno &&
			cliente.telefono
		) {
		  const nombreIniciales = cliente.nombre.slice(0, 2).toUpperCase(); // Primeras 2 letras del nombre
		  const apellidoP = cliente.apellidoPaterno.slice(0, 1).toUpperCase(); // Primera letra del apellido paterno
		  const apellidoM = cliente.apellidoMaterno.slice(0, 1).toUpperCase(); // Primera letra del apellido materno
		  const telefonoFinal = cliente.telefono.slice(-4); // Últimos 4 dígitos del teléfono
	
			const nuevaMatricula = `${nombreIniciales}${apellidoP}${apellidoM}-${telefonoFinal}`;
		  setCliente((prev) =>({
			...prev,
			matricula: nuevaMatricula
		  }));
		} else {
			setAlerta({ msg: "Completa todos los campos para generar la matrícula", error: true });
			return;
		}
	};
	 // Función para manejar cambios en los campos del formulario
	const handleChange = (e) => {
		const { name, value } = e.target;
		setCliente((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	
	  // Función para manejar el envío del formulario
	const handleSubmit = async (e) => {
		e.preventDefault();
		try{
			const { data } = await clienteAxios.put(`/cliente/update/${id}`, cliente);
			setAlerta({
				msg: data.msg,
				error: false
			})
		} catch(error){
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	};

	const toggleOptions = () =>{
		setShowOptions((prev) => !prev)
	}
	const {msg} = alerta;
	if(cargando) return <p>Cargando cliente...</p>
	return (
		<form className="border p-3 grid gap-5 justify-center" onSubmit={handleSubmit}>
			{
				msg && <Alerta alerta={alerta} />
			}
			{cliente && (
				<div className="grid grid-cols-3 gap-6 relative">
				{/* Botón para cargar o tomar foto */}
				<div className="p-3 grid grid-rows-2  justify-center items-center">
					<button
						className="hover:bg-black hover:bg-opacity-10"
						type="button"
						onClick={toggleOptions}>
						<img 
						className="rounded-lg shadow-lg"
						src={cliente.img.secure_url} alt="profile" />
					</button>
					{/* Opciones para imagen */}
					{showOptions && (
						<div className="absolute  mt-2 bg-rose-300 border border-red-900 rounded-lg shadow-lg w-48 z-10">
							<p className=" px-4 py-2 cursor-pointer text-white">¡Aun no disponible opcion para editar imagen¡</p>
						</div>
					)}
					<button
					type="button"
					onClick={ generarMatricula}>
					<input
					className="text-center text-3xl w-48 m-auto font-extrabold "
					type="text"
					value={cliente.matricula || ""}
					placeholder="2020394"
					disabled />
					<p className="text-sm py-2 text-gray-500 hover:text-gray-600">Presiona para crear matricula</p>
				</button>
				</div>

				<div className="col-span-2 grid gap-2 grid-cols-2">
					{/* Nombre */}
					<div className="grid col-span-2">
					<label className="p-1 font-bold">Nombre(s)</label>
					<input
						className="border p-2 rounded-lg"
						type="text"
						name="nombre"
						value={cliente.nombre || ""}
						onChange={handleChange}
						placeholder="Nombre"
					/>
					</div>

					{/* Apellido Paterno */}
					<div className="grid">
					<label className="p-1 font-bold">Apellido Paterno</label>
					<input
						className="border p-2 rounded-lg"
						type="text"
						name="apellidoPaterno"
						value={cliente.apellidoPaterno || ""}
						onChange={handleChange}
						placeholder="Apellido"
					/>
					</div>

					{/* Apellido Materno */}
					<div className="grid">
					<label className="p-1 font-bold">Apellido Materno</label>
					<input
						className="border p-2 rounded-lg"
						type="text"
						name="apellidoMaterno"
						value={cliente.apellidoMaterno || ""}
						onChange={handleChange}
						placeholder="Apellido"
					/>
					</div>

					{/* Teléfono */}
					<div className="grid">
					<label className="p-1 font-bold">Teléfono</label>
					<input
						className="border p-2 rounded-lg"
						type="tel"
						name="telefono"
						maxLength={10}
						value={cliente.telefono || ""}
						onChange={handleChange}
						placeholder="2222345632"
					/>
					</div>

					{/* Fecha de Nacimiento */}
					<div className="grid">
					<label className="p-1 font-bold">Nacimiento</label>
					<input
						className="border p-2 rounded-lg"
						type="date"
						name="nacimiento"
						value={cliente.nacimiento || ""}
						onChange={handleChange}
					/>
					</div>

					{/* Correo */}
					<div className="grid col-span-2">
					<label className="p-1 font-bold">Correo</label>
					<input
						className="border p-2 rounded-lg"
						type="email"
						name="email"
						value={cliente.email || ""}
						onChange={handleChange}
						placeholder="exp@ejemplo.com"
					/>
					</div>
				</div>
				</div>
			)}

			<button type="submit" className="button m-auto">
				Actualizar datos
			</button>
		</form>
	)
}

FormUpdate.propTypes = {
	id: PropTypes.string
}

export default FormUpdate