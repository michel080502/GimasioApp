import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({msg: "", error: false});

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "") {
      mostrarAlerta("El email es obligatorio", true)
      return;
    }

    setAlerta({});

    try {
      const { data } = await clienteAxios.post("/admin/olvide-password", {
        email,
      });
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;
  return (
    <>
      <div className="contenedor-auth">
        {/* Imagen para móviles */}
        <img
          className="img-auth-mobile"
          src="/assets/login.png"
          alt="logo-inicio-movil"
        />
        <h1 className="text-3xl m-6 font-bold">Reestablecer</h1>

        <form
          className=" font-medium relative flex flex-col gap-7"
          onSubmit={handleSubmit}
        >
          {msg && <Alerta alerta={alerta} />}
          <p className="text-gray-500">
            Ingresa tu correo para reestablecer tu contraseña
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

          <button
            type="submit"
            className="border-gray-500 text-white border  font-bold p-2 bg-red-800 w-52 mx-auto rounded-2xl hover:bg-red-600 transition duration-300 ease-in-out"
          >
            Enviar instrucciones
          </button>
        </form>
        <nav className="lg:flex lg:justify-center text-center">
          <p className="m-5 text-gray-600 ">
            ¿Quieres iniciar sesión?{" "}
            <span className="font-semibold text-gray-800">
              <Link to="/"> Aquí</Link>
            </span>
          </p>
        </nav>
      </div>
      <div className="contenedor-img-auth">
        <img
          className=" my-6 w-80 "
          src="/assets/login.png"
          alt="logo-inicio"
        />
      </div>
    </>
  );
};

export default OlvidePassword;
