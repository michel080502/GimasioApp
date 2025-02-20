import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

// Nuevo hook que traera datos del AuthContext
const useAuth = () =>{
	// Use context hace disponibles los valores del provider deAuthProvider 
	return useContext(AuthContext);
}

export default useAuth