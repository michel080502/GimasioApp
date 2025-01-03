import Modal from "../Modal";
import { IoMdCloseCircle } from "react-icons/io";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español

const InformeVentaVisita = ({ closeModal }) => {
  const formatoPrecio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <>
      <Modal closeModal={closeModal}>
        <div className="flex justify-between pb-3 ">
          <h2 className="text-2xl font-semibold">Informe de venta productos</h2>
          <button className="text-red-700" onClick={closeModal}>
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>
        <div className=" ">
          <div className="border grid gap-2 divide-y divide-black grid-cols-2 text-left p-3 ">
            <h3 className="font-bold text-lg ">Cliente</h3>
            <div className="col-span-2 p-1 text-base">
              <p>Nombre completo:</p>
              <p className=" font-normal">Junior H Corrido Tumbado</p>
            </div>
            <div className="p-1 text-base">
              <p>Número telefono</p>
              <p className="font-normal">2221234566</p>
            </div>
            <div className="p-1 text-base">
              <p>Correo:</p>
              <p className="font-normal">correo@correo.com</p>
            </div>
          </div>
          <div className="border grid gap-2 divide-y divide-black grid-cols-2 text-left p-3 ">
            <h3 className="font-bold text-lg ">Resumen de la compra visita</h3>
            <div className="col-span-2 flex justify-between p-1 text-base">
              <p>Fecha de compra:</p>
              <p className=" font-normal">
                {format(
                  new Date("2023-10-15T14:30:00Z"),
                  "dd 'de' MMMM, yyyy",
                  { locale: es }
                )}
              </p>
            </div>
            <div className="col-span-2 flex justify-between p-1 text-base">
              <p>Hora de compra:</p>
              <p className="font-normal">
                {format(new Date("2023-10-15T14:30:00Z"), "hh:mm a", {
                  locale: es,
                })}
              </p>
            </div>
            <div className="col-span-2 flex justify-between p-1 text-base">
              <p>Precio:</p>
              <p className="font-normal">{formatoPrecio.format(30.0)}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

InformeVentaVisita.propTypes = {
  closeModal: PropTypes.func,
};
export default InformeVentaVisita;
