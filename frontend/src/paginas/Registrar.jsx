import { useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      [
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        email,
        password,
        password2,
      ].includes("")
    ) {
      mostrarAlerta("Hay campos vacios", true);
      return;
    }
    if (password.length < 6) {
      mostrarAlerta("El password es muy corto, minimo escribe 6 valores", true);
      return;
    }
    if (password !== password2) {
      mostrarAlerta("Los password no son iguales", true);
      return;
    }

    setAlerta({});

    // Crear usuario en la API
    try {
      await clienteAxios.post(`/admin/`, {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        telefono,
        password,
      });
      mostrarAlerta("Creado correctamente, revisa email para confirmar", false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
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
          className="relative font-medium  flex flex-col gap-3 "
          onSubmit={handleSubmit}
        >
          {
            // SI en msg hay algo, entonces muestra alerta
            msg && <Alerta alerta={alerta} />
          }
          <p className="text-gray-500 text-center">
            Ingresa tu datos para crear el perfil de administración
          </p>
          <div className="md:grid md:grid-cols-2 gap-2">
            <div className="grid gap-2 col-span-2 my-1">
              <label className="font-bold">Nombre(s):</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid gap-1 my-2">
              <label className="font-bold">Apellido Paterno:</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                placeholder="Apellido paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
              />
            </div>
            <div className="grid gap-1 ">
              <label className="font-bold">Apellido Materno:</label>
              <input
                className="border font-normal border-gray-600 rounded-xl p-2"
                placeholder="Apellido materno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
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
        <nav className="lg:flex lg:justify-center text-center">
          <p className="m-2 text-gray-600">
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
