import { useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([nombre, apellido, telefono, email, password, password2].includes("")) {
      setAlerta({ msg: "Hay campos vacios", error: true });
      return;
    }
    if (password.length < 6) {
      setAlerta({
        msg: "El password es muy corto, minimo escribe 6 valores",
        error: true,
      });
      return;
    }

    if (password !== password2) {
      setAlerta({ msg: "Los password no son iguales", error: true });
      return;
    }

    setAlerta({});

    // Crear usuario en la API
    try {
      await clienteAxios.post(`/admin/`, {
        nombre,
        apellido,
        email,
        telefono,
        password,
      });
      setAlerta({
        msg: "Creado correctamente, revisa email para confirmar",
        error: false,
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;
  return (
    <>
      <div className="hidden md:flex bg-zinc-800 text-white h-dvh w-full flex-col justify-center place-items-center rounded-r-2xl">
        <img
          className=" my-6 w-80 "
          src="/assets/login.png"
          alt="logo-inicio"
        />
      </div>
      <div className="contenedor-auth">
        {/* Imagen para móviles */}
        <img 
          className="img-auth-mobile" 
          src="/assets/login.png" 
          alt="logo-inicio-movil" 
				/>
        <h1 className="text-3xl m-2 font-bold">Registrarse</h1>
        
        <form
          autoComplete="off"
          className=" font-medium  flex flex-col gap-7 "
          onSubmit={handleSubmit}
        >
          {
          // SI en msg hay algo, entonces muestra alerta
          msg && <Alerta alerta={alerta} />
        }
          <p className="text-gray-500 text-center">
            Ingresa tu datos para crear el perfil de administración
          </p>
          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="font-bold">Nombre</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid gap-1 ">
              <label className="font-bold">Apellidos</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="font-bold">Numero de telefono</label>
            <input
              className="border font-normal border-gray-600 rounded-xl p-2"
              type="tel"
              placeholder="2221113322"
              maxLength={10}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <label className="font-bold">Email</label>
            <input
              className="border font-normal border-gray-600 rounded-xl p-2"
              type="email"
              placeholder="correo@eje.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="md:grid md:grid-cols-2 gap-2">
            <div className="grid gap-1">
              <label className="font-bold">Password</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="font-bold">Confirmar password</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                type="password"
                placeholder="******"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="border-gray-500 text-white border  font-bold p-2 bg-red-800 w-52 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out"
          >
            Crear cuenta
          </button>
        </form>
        <nav className="lg:flex lg:justify-center text-center" >
          <p className="m-5 text-gray-600">
            ¿Quieres iniciar sesión?{" "}
            <span className="font-semibold text-gray-800">
              <Link to="/"> Ingresa aqui</Link>
            </span>
          </p>
        </nav>
      </div>
    </>
  );
};

export default Registrar;
