import { RiFileExcel2Fill } from "react-icons/ri";

import PropTypes from "prop-types";

const ViewReStock = ({ products }) => {
  const dataFilter = () => {
    if (!Array.isArray(products)) {
      return [];
    }
    const resultado = products.filter(
      (product) => product.nivel_stock === "Bajo"
    );

    return resultado;
  };

  return (
    <div className="p-4 grid gap-2">
      <div>
        <h1 className="text-3xl font-bold">Re-stock necesario</h1>
        <p>
          Los siguientes productos necesitan de más suministros o pasaran a no
          disponible
        </p>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-lg">
        <div className="p-2 grid md:grid-cols-5 gap-2 md:gap-5">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <div className="col-span-2 gap-2">
              <h1 className=" font-bold text-xl">Productos bajo stock</h1>
              <p>Menos de 10 en stock</p>
            </div>

            <div className="flex md:hidden w-full md:w-0 items-center">
              <button className="w-full m-2 bg-black rounded-lg text-white hover:bg-red-900  hover:scale-110 p-2 transition-all duration-300">
                <RiFileExcel2Fill className="m-auto text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Foto</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Nombre</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Marca</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Categoria</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Stock</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Precio final</th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {dataFilter ? (
                dataFilter().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      <p>{index + 1}</p>
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">
                      <img
                        className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                        src={item.img_secure_url}
                        alt={item.nombre}
                      />
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {item.nombre}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {item.marca}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {item.categoria}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {item.stock}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      ${item.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={1} className="hover:bg-gray-100 ">
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>No hay productos con bajo stock</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ViewReStock.propTypes = {
  products: PropTypes.array,
};
export default ViewReStock;
