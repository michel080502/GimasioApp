import PropTypes from "prop-types";
const Memberships = ({ membresias, seleccionarMembresia, formatoPrecio }) => {
  return (
    <>
      <h2 className="flex justify-between text-lg p-2 text-gray-600 ">
        <span className="rounded-full px-[9px] ring ring-gray-400 ">2</span>
        Selecciona membresia
      </h2>
      <div className=" border  rounded-lg ">
        <div className=" my-auto grid gap-2 p-2">
          <div className="grid grid-cols-4 gap-2">
            {membresias
              .filter((m) => m.disponible)
              .map((m, index) => (
                <article
                  key={m.id}
                  className="border rounded-lg hover:border-gray-700 p-3 grid gap-2"
                >
                  <div className="rounded-full w-6 h-6 text-center border border-gray-700 ">
                    <p className="text-sm">{index + 1}</p>
                  </div>
                  <div className="text-sm">
                    <p>Tipo de membresia:</p>
                    <p className="font-normal">{m.nombre}</p>
                  </div>
                  <div className="text-sm">
                    <p>Beneficios:</p>
                    <ul className="font-normal list-inside list-disc">
                      {m.beneficios.map((b, index) => (
                        <li key={index}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p>Duración:</p>
                    <p className="font-normal">{m.duracion_dias} días</p>
                  </div>
                  <div className="text-sm">
                    <p>Precio:</p>
                    <p className="font-normal">
                      {formatoPrecio.format(m.precio)}
                    </p>
                  </div>
                  <button
                    className="bg-gray-700 text-sm text-white p-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                    onClick={() => {
                      seleccionarMembresia(m);
                    }}
                  >
                    Seleccionar
                  </button>
                </article>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

Memberships.propTypes = {
  seleccionarMembresia: PropTypes.func,
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat).isRequired,
  membresias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      beneficios: PropTypes.array,
      duracion_dias: PropTypes.number,
      precio: PropTypes.number,
      disponible: PropTypes.bool,
    })
  ),
};

export default Memberships;
