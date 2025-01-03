import Modal from "../Modal";
import { IoMdCloseCircle } from "react-icons/io";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español

const InformeVentaProducto = ({ closeModal }) => {
  const formatoPrecio = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
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
            <h3 className="font-bold text-lg ">Resumen de la compra</h3>
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
            <div className="p-1 col-span-2 text-base">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr className="divide-x divide-black text-center">
                    <th className="py-2 px-3">Cantidad</th>
                    <th className="py-2 px-3">Foto</th>
                    <th className="py-2 px-3">Producto</th>
                    <th className="py-2 px-3">Categoria</th>
                    <th className="py-2 px-3"> Precio c/u</th>
                    <th className="py-2 px-3">Total</th>
                  </tr>
                </thead>
                <tbody className="text-center font-normal">
                  <tr className="divide-x">
                    <td className="py-2 px-3">2</td>
                    <th className="py-2 px-3">
                      <img
                        className="w-10 h-10 rounded-full "
                        src="/../assets/proteina.jpg"
                        alt="proteina"
                      />
                    </th>
                    <td className="py-2 px-3">Proteina whey</td>
                    <td className="py-2 px-3">Proteina</td>
                    <td className="py-2 px-3">{formatoPrecio.format(500.00)}</td>
                    <td className="py-2 px-3">{formatoPrecio.format(1000.00)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between p-3">
                <p>Total de la compra:</p>
                <span className="text-2xl">{formatoPrecio.format(2000.00)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

InformeVentaProducto.propTypes = {
  closeModal: PropTypes.func,
};

export default InformeVentaProducto;
