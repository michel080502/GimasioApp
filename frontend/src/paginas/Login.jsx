import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';

function Login() {
	const [ email, setEmail] = useState('');
	const [ password, setPassword] = useState('');
	const [ alerta, setAlerta] = useState({});
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	const handleSubmit = async (e) =>{
		e.preventDefault();

		if([email, password].includes('')){
			setAlerta({
				msg: 'Todos los campos son obligatorios',
				error: true
			})
			return;
		}
		if(password.length < 6){
			setAlerta({
				msg: 'La contraseña debe ser mayor a 6 caracteres',
				error: true
			})
			return;
		}

		try {
			const { data } = await clienteAxios.post('/admin/login', { email, password });
			localStorage.setItem('token', data.token);
			setAuth(data);
			navigate('/admin')
		} catch(error){
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	}

	const { msg } = alerta;
	return (
		<>
			<div className="shadow-md w-3/4 shadow-slate-600 p-3 mx-20 rounded-2xl h-4/5 flex flex-col justify-center items-center gap-3">
				<h1 className="text-5xl m-6 font-bold">Inicia sesión</h1>
				{msg && 
				<Alerta
					alerta={alerta}
				/>
				}
				<form 
				className=" font-medium  flex flex-col gap-7"
				onSubmit={handleSubmit}>
					<p className="text-gray-500">Ingresa tu credenciales para ingresar al sistema</p>
					<div className="grid gap-1">
						<label 
							className="font-bold" 
							id="email" 
							htmlFor="email"
						>Email</label>
						<input 
							className="border font-normal border-gray-600 rounded-xl p-2" 
							id="email" 
							type="email" 
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Correo"/>
					</div>
					<div className="grid gap-1">
						<label 
							className="font-bold" 
							htmlFor="">Password</label>
						<input 
							className="border font-normal border-gray-600 rounded-xl p-2" 
							type="password" 
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="******"/>
					</div>
					<button 
						type="submit"
						className="border-gray-500 text-white border  font-bold p-2 bg-red-800 w-40 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out"
					>Acceder</button>
				</form>
			<nav className='lg:flex lg:justify-center '>
				<p className="m-5 text-gray-600 ">¿No tienes cuenta? <span className='font-semibold text-gray-800'><Link to="/registrar">Aquí</Link></span></p>
				<p className="m-5 text-gray-600 ">¿Olvidaste contraseña? <span className='font-semibold text-gray-800'><Link to="/olvide-password"> Reestablece aqui</Link></span></p>
			</nav>
			</div>
			<div className="bg-zinc-800 text-white h-dvh w-full flex flex-col justify-center place-items-center rounded-l-2xl">
				<img className=" my-6 w-80 " src="/assets/login.png" alt="logo-inicio" />
			</div>
		</>
	)
}

export default Login;