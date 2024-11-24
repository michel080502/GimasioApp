
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";

const NuevoPassword = () => {
	const [ password, setPassword ] = useState('');
	const [ alerta, setAlerta ] = useState({});
	const [ tokenValido, setTokenValido ] = useState('');
	const [ passwordModificado, setPasswordModificado ] = useState(false);

	const params = useParams();
	const { token } = params;
	// Use efect se ejecuta cuando el componente se carge
	useEffect(() => {
		const comprobarToken = async () =>{
			try{
				await clienteAxios(`/admin/olvide-password/${token}`)
				setAlerta({
					msg: 'Coloca tu nuevo password',
					error: false
				});
				setTokenValido(true);
			} catch (error){
				setAlerta({
					msg: error.response.data.msg,
					error: true
				})
			}
		}
		comprobarToken();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if(password.length < 6){
			setAlerta({
				msg: 'El password debe ser de al menos 6 caracteres',
				error: true
			})
			return;
		}

		setAlerta({})

		try{
			const url = `/admin/olvide-password/${token}`;
			const { data } = await clienteAxios.post(url, { password });
			console.log(data); 
			setAlerta({
				msg: data.msg,
				error: false
			})
			setPasswordModificado(true);
			setPassword('');
		} catch (error){
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
			<h1 className="text-5xl m-6 font-bold">Nuevo password</h1>
			{msg && 
				<Alerta
					alerta={alerta}
				/>
			}
			{
			tokenValido && (
				<>
				<form 
					className=" font-medium  flex flex-col gap-7"
					onSubmit={handleSubmit}
					>
					<p className="text-gray-500">Ingresa tu nuevo password</p>
					<div className="grid gap-1">
						<label 
							className="font-bold" 
							id="password" 
							htmlFor="password"
						>Nuevo password</label>
						<input 
							className="border font-normal border-gray-600 rounded-xl p-2" 
							id="password" 
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="******"/>
					</div>

					<button
						type='submit'
						className="border-gray-500 text-white border  font-bold p-2 bg-red-800 w-52 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out">Guardar nuevo password</button>
				</form>
				{passwordModificado && 
					<span className='font-semibold text-gray-800'><Link to="/"> Inicia Sesión</Link></span>
				}
				</>
			)
			}
			
			
			</div>
			<div className="bg-zinc-800 text-white h-dvh w-full flex flex-col justify-center place-items-center rounded-l-2xl">
				<img className=" my-6 w-80 " src="/assets/login.png" alt="logo-inicio" />
			</div>
		</>
	)
}

export default NuevoPassword