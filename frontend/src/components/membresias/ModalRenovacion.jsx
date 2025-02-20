import Modal from "../../components/Modal";
import Alerta from "../Alerta";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clienteAxios from "../../config/axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ModalRenovacion = ({ closeModal, renewalClient }) => {
  const [memberships, setMemberships] = useState([]);
  const [vista, setVista] = useState("opciones");
  const [alerta, setAlerta] = useState({ msg: "", error: false, type: "" });
  const [membershipSelect, setMembershipSelect] = useState(null);
  const [infoSale, setInfoSale] = useState(null);

  const formatoPrecio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const mostrarAlerta = (msg, error, type) => {
    setAlerta({ msg, error, type });
    setTimeout(() => {
      setAlerta({ msg: "", error: false, type: "" });
    }, 4000);
  };

  // Seleccionar membresia nueva
  const handleMembership = (id) => {
    setMembershipSelect(membershipSelect === id ? null : id); // Alternar selección
  };

  const handleRenewal = async () => {
    try {
      const { membresia_id, cliente_id } = renewalClient;
      const { data } = await clienteAxios.post("/compra/renovar-membresia", {
        id_cliente: cliente_id,
        id_membresia: membresia_id,
      });
      setInfoSale(data.renovacion);
      setVista("mensaje");
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true, "renovacion");
    }
  };

  const handleNewMembership = async () => {
    try {
      const { cliente_id } = renewalClient;
      const { data } = await clienteAxios.post("/compra/membresia", {
        id_cliente: cliente_id,
        id_membresia: membershipSelect,
      });
      setInfoSale(data.compra);
      setVista("mensaje");
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true, "nueva");
    }
  };

  const { msg, type } = alerta;
  // Obtenemos membresias
  useEffect(() => {
    const getMemberships = async () => {
      try {
        const { data } = await clienteAxios("/membresia/");
        setMemberships(data);
      } catch (error) {
        console.log(error);
        setMemberships([]);
      }
    };

    getMemberships();
  }, []);

  return (
    <>
      <Modal closeModal={closeModal}>
        {vista === "opciones" && (
          <div className="relative">
            {type === "renovacion" && <Alerta alerta={alerta} />}
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Opciones de renovación</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>

            <div className="grid gap-3 justify-center">
              <h3>Datos del cliente</h3>
              <div className="flex justify-center gap-2">
                <p className="text-gray-500 font-medium">Nombre:</p>
                <p>{`${renewalClient.cliente_nombre} ${renewalClient.cliente_apellido_paterno} ${renewalClient.cliente_apellido_materno}`}</p>
              </div>
              <h3>Membresia</h3>
              <div className="flex justify-center gap-2">
                <p className="text-gray-500 font-medium">Tipo:</p>
                <p>{renewalClient.membresia_nombre}</p>
              </div>
              <div className="flex justify-center gap-2">
                <p className="text-gray-500 font-medium">Precio:</p>
                <p>{formatoPrecio.format(renewalClient.membresia_precio)}</p>
              </div>

              <p></p>
              <div className="flex gap-6">
                <button
                  className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                  type="button"
                  onClick={handleRenewal}
                >
                  Misma membresia
                </button>
                <button
                  className="bg-blue-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-blue-900 transform duration-200 m-auto"
                  onClick={() => setVista("formulario")}
                >
                  Elegir nueva membresia
                </button>
              </div>
            </div>
          </div>
        )}

        {vista === "formulario" && (
          <div>
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Otras membresías</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>
            {msg && <Alerta alerta={alerta} />}
            <div className="grid gap-3 py-2">
              <button
                className=" bg-opacity-80p-2 hover:bg-opacity-100 text-3xl text-orange-600 m-auto rounded-full hover:text-orange-700 transform duration-200"
                type="button"
                onClick={() => setVista("opciones")}
              >
                <BsArrowLeftCircleFill />
              </button>
              <h1>Lista de membresías disponibles</h1>
              <div className="grid font-normal gap-3">
                {memberships.map((m, index) => (
                  <div
                    key={index}
                    onClick={() => handleMembership(m.id)}
                    className={`p-3 grid grid-cols-2 gap-5 border rounded-md cursor-pointer ${
                      membershipSelect === m.id
                        ? "bg-green-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="text-base font-semibold">{m.nombre}</h3>
                      <p className="font-semibold">Beneficios:</p>
                      <ul className="list-disc ml-5">
                        {m.beneficios.map((b, index) => (
                          <li key={index}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-1 items-center">
                      <p>
                        <span className="font-semibold">Duración:</span>{" "}
                        {m.duracion_dias} días
                      </p>
                      <p>
                        {" "}
                        <span className="font-semibold">Precio:</span>{" "}
                        {formatoPrecio.format(m.precio)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="text-sm bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2 m-auto"
                type="button"
                onClick={handleNewMembership}
              >
                Renovar membresía
              </button>
            </div>
          </div>
        )}

        {vista === "mensaje" && (
          <div>
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Mensaje de renovación</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>

            <div className="grid gap-3 justify-center">
              <h3 className="text-green-700 font-bold">
                Membresía actualizada correctamente
              </h3>
              <div className="flex justify-between">
                <p className="text-gray-500 ">Cliente:</p>
                <p>{`${renewalClient.cliente_nombre} ${renewalClient.cliente_apellido_paterno} ${renewalClient.cliente_apellido_materno}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Fecha compra:</p>
                <p>
                  {" "}
                  {format(
                    new Date(infoSale.fecha_compra),
                    "dd 'de' MMMM, yyyy",
                    {
                      locale: es,
                    }
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Fecha expiración:</p>
                <p>
                  {" "}
                  {format(
                    new Date(infoSale.fecha_expiracion),
                    "dd 'de' MMMM, yyyy",
                    {
                      locale: es,
                    }
                  )}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-green-600 bg-opacity-80 text-white p-2 rounded-md hover:bg-opacity-100"
                  onClick={closeModal}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

ModalRenovacion.propTypes = {
  closeModal: PropTypes.func,
  renewalClient: PropTypes.object,
};

export default ModalRenovacion;
