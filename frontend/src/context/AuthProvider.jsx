import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/axios'
import PropTypes from 'prop-types'

const AuthContext = createContext() 

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null) // Estado de ejemplo para el contexto
	const [ cargando, setCargando ] = useState(true);

	useEffect(() =>{
		const autenticarUsuario = async () =>{
			const token = localStorage.getItem('token');
			if (!token) {
				setCargando(false)
				return
			}
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			}
			try {
				const { data } = await clienteAxios('/admin/perfil', config);
				setAuth(data);
			} catch (error){
				console.log('Error:', error.response.data.msg)
			}
			setCargando(false);
		}
		autenticarUsuario();
	}, []);  // Dependencias vacias para que se ejecute 1 vez

	const cerrarSesion = () =>{
		localStorage.removeItem('token');
		setAuth({});
	}

    return (
        <AuthContext.Provider 
			value={ //  los valores disponibles cuando se mande a llamar el hook de useAuth
				{ auth, setAuth, cargando, cerrarSesion }
			}
		>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node
}

export {
    AuthProvider
}

export default AuthContext
