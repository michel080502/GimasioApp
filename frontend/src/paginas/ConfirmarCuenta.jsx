import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link }from 'react-router-dom'
import clienteAxios from '../config/axios';
import Alerta from '../components/Alerta';

const ConfirmarCuenta = () => {
  const [ cuentaConfirmada, setCuentaConfirmada ] = useState(false);
  const [ cargando, setCargando ] = useState(true);
  const [ alerta, setAlerta] = useState({msg: '', error:false });

  const params = useParams();
  const { token } = params;

  useEffect(() =>{
    const confirmarCuenta = async () =>{
      try{
        // const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/confirmar/${token}`;
        // const { data } = await axios(url);
        const { data } = await clienteAxios(`/admin/confirmar/${token}`);
        setCuentaConfirmada(true);
        setAlerta({
          msg: data.msg,
          error: false
        })
      } catch(error){
        setAlerta({
          msg: error.response.data.msg,
          error: true
        });
      }
      setCargando(false);
    }
    confirmarCuenta();
  }, [])
  return (
    <>
      <div className="bg-zinc-800 text-white h-dvh w-full flex flex-col justify-center place-items-center rounded-r-2xl">
        <img className=" my-6 w-80 " src="/assets/login.png" alt="logo-inicio" />
          
      </div>
      <div className="relative shadow-md w-3/4 shadow-slate-600 p-3 mx-20 rounded-2xl  flex flex-col justify-center items-center gap-2">
          <h1 className="text-5xl m-2 font-bold">Confirmar cuenta y administra tu gimnasio</h1>

          {!cargando && 
          <Alerta
            alerta={alerta}
          />}

          {cuentaConfirmada && (
            <span className='font-semibold text-gray-800'><Link to="/"> Inicia Sesión</Link></span>
          )}
      </div>
        
      </>
  )
}

export default ConfirmarCuenta