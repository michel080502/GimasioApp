import { Navigate, Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth'
function Dashboard() {
  // Aqui recibimos el useAuth para saber si está logueado o no
  const { auth, cargando } = useAuth(); 
  
  if(cargando) return 'cargando....'
  return (

    <>
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen'>
      <div className='h-full'>
        <SideBar admin={auth?.admin || {}} />
      </div> 
      <main className='lg:col-span-3 xl:col-span-5 overflow-x-auto'>
        <Header admin={auth?.admin || {}} />
        {auth.admin?._id ? (<Outlet />) : (<Navigate to="/"/>)} 
      </main>
      
    </div>
      
    </>
	
  )
}

export default Dashboard