import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";
import useAuth from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      mostrarAlerta("Todos los campos son obligatorios", true);
      return;
    }
    if (password.length < 6) {
      mostrarAlerta("La contraseña debe ser mayor a 6 caracteres", true);
      return;
    }

    try {
      const { data } = await clienteAxios.post("/admin/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setAuth(data);
      navigate("/admin");
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;
  return (
    <>
      <div className="contenedor-auth ">
        {/* Imagen para móviles */}
        <img
          className="img-auth-mobile"
          src="/assets/login.png"
          alt="logo-inicio-movil"
        />
        <h1 className="text-3xl m-6 font-bold">Inicia sesión</h1>

        <form
          className="relative font-medium  flex flex-col gap-7"
          onSubmit={handleSubmit}
        >
          {msg && <Alerta alerta={alerta} />}
          <p className="text-gray-500">
            Ingresa tu credenciales para ingresar al sistema
          </p>
          <div className="grid gap-1">
            <label className="font-bold" id="email" htmlFor="email">
              Email
            </label>
            <input
              className="border font-normal border-gray-600 rounded-xl p-2"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-bold" htmlFor="">
              Password
            </label>
            <input
              className="border font-normal border-gray-600 rounded-xl p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className=" text-white border  font-bold p-2 bg-red-800 w-40 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out"
          >
            Acceder
          </button>
        </form>
        <nav className="lg:flex lg:justify-center text-center">
          <p className="m-5 text-gray-600 ">
            ¿No tienes cuenta?{" "}
            <span className="font-semibold text-gray-800">
              <Link to="/registrar">Aquí</Link>
            </span>
          </p>
          <p className="m-5 text-gray-600 ">
            ¿Olvidaste contraseña?{" "}
            <span className="font-semibold text-gray-800">
              <Link to="/olvide-password"> Reestablece aqui</Link>
            </span>
          </p>
        </nav>
      </div>
      {/* Imagen lateral para pantallas grandes */}
      <div className="contenedor-img-auth">
        <img
          className="my-6 w-80"
          src="/assets/login.png"
          alt="logo-inicio-desktop"
        />
      </div>
    </>
  );
}

export default Login;
