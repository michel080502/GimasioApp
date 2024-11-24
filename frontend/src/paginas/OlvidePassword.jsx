import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/axios'

const OlvidePassword = () => {
	const [ email, setEmail ] = useState('');
	const [ alerta, setAlerta ] = useState({});

	const handleSubmit = async (e) =>{
		e.preventDefault();

		if(email === ''){
			setAlerta({
				msg: 'El email es obligatorio',
				error: true
			})
			return;
		}

		setAlerta({});

		try{
			const { data } = await clienteAxios.post('/admin/olvide-password', { email });
			setAlerta({
				msg: data.msg,
				error: false
			})
		} catch (error) {
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
			<h1 className="text-5xl m-6 font-bold">Reestablecer</h1>
			{msg && 
				<Alerta
					alerta={alerta}
				/>
			}
			<form 
				className=" font-medium  flex flex-col gap-7" 
				onSubmit={handleSubmit}>
				<p className="text-gray-500">Ingresa tu correo para reestablecer tu contraseña</p>
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

				<button
					type='submit'
					className="border-gray-500 text-white border  font-bold p-2 bg-red-800 w-52 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out">Enviar instrucciones</button>
			</form>
			<nav>
				<p className="m-5 text-gray-600 ">¿Quieres iniciar sesión? <span className='font-semibold text-gray-800'><Link to="/"> Aquí</Link></span></p>
			</nav>
		</div>
		<div className="bg-zinc-800 text-white h-dvh w-full flex flex-col justify-center place-items-center rounded-l-2xl">
			<img className=" my-6 w-80 " src="/assets/login.png" alt="logo-inicio" />
		</div>
    </>
  )
}

export default OlvidePassword