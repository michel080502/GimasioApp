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
      <header className="fixed top-0 w-full bg-zinc-900 z-10">
        <Header admin={auth || {}} />
      </header>

      <div className="flex flex-1 md:pt-[60px]">
        {/* Sidebar Fijo */}
        <div className=" md:w-64 w-0 bg-zinc-900 flex-shrink-0">
          <SideBar admin={auth || {}} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div >
            {/* Mostrar la página de contenido */}
            {auth?.id ? <Outlet /> : <Navigate to="/" />}
          </div>
        </main>
      </div>
    </div>


      
    </>
	
  )
}

export default Dashboard