import Modal from "../Modal";
import { IoMdCloseCircle } from "react-icons/io";

import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español

const InformeVentaMembresia = ({ closeModal, purchaseSelected }) => {
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
          <h2 className="text-2xl font-semibold">
            Informe de venta membresias
          </h2>
          <button className="text-red-700" onClick={closeModal}>
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>
        <div className=" ">
          <div className="border grid gap-2 divide-y divide-black grid-cols-2 text-left p-3 ">
            <h3 className="font-bold text-lg ">Cliente</h3>
            <div className="col-span-2 p-1 text-base">
              <p>Nombre completo:</p>
              <p className=" font-normal">{`${purchaseSelected.cliente_nombre} ${purchaseSelected.cliente_apellido_paterno} ${purchaseSelected.cliente_apellido_materno}`}</p>
            </div>
            <div className="p-1 text-base">
              <p>Número telefono</p>
              <p className="font-normal">{purchaseSelected.cliente_telefono}</p>
            </div>
            <div className="p-1 text-base">
              <p>Correo:</p>
              <p className="font-normal">{purchaseSelected.cliente_email}</p>
            </div>
          </div>
          <div className="border grid gap-2 divide-y divide-black grid-cols-2 text-left p-3 ">
            <h3 className="font-bold text-lg ">Resumen de la compra</h3>
            <div className="col-span-2 flex justify-between p-1 text-base">
              <p>Fecha de compra:</p>
              <p className=" font-normal">
                {" "}
                {format(
                  new Date(purchaseSelected.fecha_compra),
                  "dd 'de' MMMM, yyyy",
                  { locale: es }
                )}
              </p>
            </div>
            <div className="col-span-2 flex justify-between p-1 text-base">
              <p>Hora de compra:</p>
              <p className="font-normal">
                {format(new Date(purchaseSelected.fecha_compra), "hh:mm a", {
                  locale: es,
                })}
              </p>
            </div>
            <div className="p-1 col-span-2 text-base">
              <div className="flex justify-between p-1">
                <p>Tipo de membresia:</p>
                <p className="font-normal">
                  {purchaseSelected.membresia_nombre}
                </p>
              </div>
              <div className="p-1 flex justify-between items-center">
                <p>Beneficios:</p>
                <ul className="list-disc font-normal">
                  {purchaseSelected.membresia_beneficios.map(
                    (beneficio, index) => (
                      <li key={index}>{beneficio}</li>
                    )
                  )}
                </ul>
              </div>
              <div className="p-1 flex justify-between">
                <p>Fecha expiración:</p>
                <p className="font-normal">
                  {format(
                    new Date(purchaseSelected.fecha_expiracion),
                    "dd 'de' MMMM, yyyy",
                    { locale: es }
                  )}
                </p>
              </div>
              <div className="flex justify-between p-1">
                <p> Precio:</p>
                <span className="text-2xl">
                  {formatoPrecio.format(purchaseSelected.membresia_precio)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

InformeVentaMembresia.propTypes = {
  closeModal: PropTypes.func,
  purchaseSelected: PropTypes.object,
};
export default InformeVentaMembresia;
