import {Link }from "react-router-dom";
const Error404 = () => {
  return (
    <div className="flex gap-4 bg-white w-screen h-screen p-16">
      <div className="m-auto">
        <img
          className="rounded-full"
          src="/assets/error404.avif"
          alt="error404"
        />
      </div>
      <div className="text-center m-auto">
        <h1 className="font-bold text-6xl font-serif">
          Error<span> 404!</span>
        </h1>
        <p className="text-pretty text-2xl p-4">
          Pagina no encontrada, retroceda a la pagina anterior o ingrese a
          dashboard principal....
        </p>
        <Link
          to="/admin"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Error404;
