import { Outlet } from 'react-router-dom'
const AuthLayout = () => {
	return (
		<>
			{/* Esta parte de outlet deja un espacio recervado para que al usar este authLayout, pueda ingresar mas componentes dentro de este mismo en etse caso en app.jsx */}
			<main className=" w-dvw md:grid md:grid-cols-2 h-screen justify-center items-center" >
			<Outlet />
			</main>
		</>
	)
}

export default AuthLayout;