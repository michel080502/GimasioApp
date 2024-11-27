import { RiDashboardFill , RiMoneyDollarCircleFill, RiSettings3Fill,RiCloseLargeFill  } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { FaStoreAlt } from "react-icons/fa";
import { CgGym, CgDetailsMore  } from "react-icons/cg";
import { BsFillPassportFill } from "react-icons/bs";
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { useState } from "react"
import useAuth from "../hooks/useAuth";

const SideBar = ({ admin }) => {
	const [ showMenu, setShowMenu ] = useState(false);
	const { cerrarSesion } = useAuth();
	return (
	<>
		<aside 
		className={`bg-zinc-900 h-full flex flex-col fixed md:static w-[80%] md:w-[20%] lg:w-full transition-all duration-500
			${showMenu ? "left-0" : "-left-full"}`}>
			<div className="flex flex-col items-center justify-center p-8 gap-4"> 
				<img 
					src="/assets/logo.jpg"
					className="w-20 h-20 object-cover rounded-full ring-4 ring-red-900"
				/>
				<h1 className=" text-center text-white font-bold">{`${admin.nombre} ${admin.apellido}`}</h1>
				<button 
					className="button"
					onClick={cerrarSesion}>
					Cerrar sesión</button>
			</div>
			<nav className=" bg-zinc-800 rounded-tr-[40px] h-full flex flex-col justify-between">
				<div>
					<NavLink 
						to="/admin" 
						end
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<RiDashboardFill /> Dashboard
						
					</NavLink>
					
					<NavLink 
						to="/admin/clientes" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<FaUsers /> Clientes
					</NavLink>
					<NavLink 
						to="/admin/productos" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<FaStoreAlt /> Productos
					</NavLink>
					<NavLink 
						to="/admin/membresias" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<BsFillPassportFill /> Membresias
					</NavLink>
					<NavLink 
						to="/admin/entrenadores" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<CgGym /> Entrenadores
					</NavLink>
					<NavLink 
						to="/admin/ventas" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
						<RiMoneyDollarCircleFill /> Ventas
					</NavLink>
				</div>
				<NavLink 
						to="/admin/configuracion" 
						className={({ isActive }) => 
						`flex font-bold items-center gap-5 rounded-md p-3 text-white 
						${isActive ? 'border-l-4 border-b-2 rounded-tr-[40px]' : 'hover:border-l-4 hover:border-b-2 transition-[border-width] duration-300 ease-in-out'}`
					}>
					<RiSettings3Fill /> Configuración
				</NavLink>
			</nav>
		</aside>
		{/* Boton para cerrar el sidebar en movil */}
		<button 
			
			className={`lg:hidden w-auto fixed bottom-4 text-2xl  bg-zinc-900 text-white rounded-full  p-2.5 transition-all duration-500 ease-in-out
				${showMenu ?  "right-4" : "left-4" }`}
			onClick={() => setShowMenu(!showMenu)}>
			{showMenu ? <RiCloseLargeFill /> : <CgDetailsMore /> }
		</button>
	</>
	)
}

SideBar.propTypes = {
	admin: PropTypes.shape({
		nombre: PropTypes.string.isRequired,
		apellido: PropTypes.string.isRequired,
		// Agrega otras propiedades si es necesario
	}).isRequired,
};

export default SideBar