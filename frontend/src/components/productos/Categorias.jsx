import { BsFillTrashFill } from "react-icons/bs";
import { useState } from "react";
import clienteAxios from "../../config/axios";
import Alerta from "../Alerta";
import PropTypes from "prop-types";

const Categorias = ({
  categorias,
  loadingCategorias,
  recargarDatos,
  actualizarCategorias,
}) => {
  const [formData, setFormData] = useState({ nombre: "" });
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await clienteAxios.post(`/producto/crear-categoria`, {
        nombre: formData.nombre,
      });
      mostrarAlerta(data.msg, false);
      recargarDatos();
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await clienteAxios.delete(
        `/producto/categoria-delete/${id}`
      );
      mostrarAlerta(data.msg, false);
      actualizarCategorias(id);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;

  if (loadingCategorias) return <p>Cargando....</p>;
  return (
    <div className="grid gap-3">
      {msg && <Alerta alerta={alerta} />}
      <div
        className={`grid gap-2 ${
          categorias.length <= 4
            ? `grid-cols-${categorias.length}`
            : categorias.length == 0
            ? ""
            : "grid-cols-4"
        }`}
      >
        {categorias.length === 0 ? (
          <p>No hay categorias en el sistema</p>
        ) : (
          categorias.map((categoria, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-lg p-1 shadow-lg flex items-center gap-1 justify-center"
            >
              <button>
                <BsFillTrashFill
                  className="text-red-600 hover:text-red-800 transform duration-200 text-lg"
                  onClick={() => {
                    handleDelete(categoria.id);
                  }}
                />
              </button>

              <p className="font-semibold text-center">{categoria.nombre}</p>
            </div>
          ))
        )}
      </div>
      <form className="grid px-3" onSubmit={handleSubmit}>
        <label className=" m-1 font-bold">Nombre categoria</label>
        <input
          className="border p-2 rounded-lg"
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="ejm: Proteina"
        />
        <button type="submit" className="mt-4 button w-32 m-auto">
          Guardar
        </button>
      </form>
    </div>
  );
};

Categorias.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  loadingCategorias: PropTypes.bool,
  recargarDatos: PropTypes.func,
  actualizarCategorias: PropTypes.func,
};

export default Categorias;
