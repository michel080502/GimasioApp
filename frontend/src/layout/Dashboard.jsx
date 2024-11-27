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
    <div className="min-h-screen flex flex-col">
      {/* Header Fijo */}
      <header className="fixed top-0 w-full bg-zinc-900 text-white z-10">
        <Header admin={auth || {}} />
      </header>

      <div className="flex flex-1 md:pt-[60px]"> {/* Ajusta pt según la altura de tu header */}
        {/* Sidebar Fijo */}
        <div className="fixed z-100 h-[93%] w-[20%]">
          <SideBar admin={auth || {}} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className=" md:pl-[20%]">
            {/* Mostrar la página de contenido */}
            {auth?._id ? <Outlet /> : <Navigate to="/" />}
          </div>
        </main>
      </div>
    </div>


      
    </>
	
  )
}

export default Dashboard