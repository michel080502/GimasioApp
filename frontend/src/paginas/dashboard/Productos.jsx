import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

import CardInforme from "../../components/productos/CardInforme";
import Modal from "../../components/Modal";
import FormRegistro from "../../components/productos/FormRegistro";
import TablaProductos from "../../components/productos/TablaProductos";
import FormUpdate from "../../components/productos/FormUpdate";
import Categorias from "../../components/productos/Categorias";

import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";

const Productos = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [reload, setReload] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [dataType, setDataType] = useState("");

  const formatoPrecio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    const getCategorias = async () => {
      try {
        const { data } = await clienteAxios.get("/producto/categorias");
        setCategorias(data);
      } catch (error) {
        console.log("Error al obtener categorias", error);
        setCategorias([]);
      } finally {
        setLoadingCategorias(false);
      }
    };
    const getProductos = async () => {
      try {
        const { data } = await clienteAxios.get("/producto/");
        setProductos(data);
      } catch (error) {
        console.log("Error al obtener categorias", error);
        setProductos([]);
      }
    };
    getCategorias();
    getProductos();
  }, [reload]);

  const recargarDatos = () => setReload((prev) => !prev);

  const actualizarCategorias = (id) => {
    setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
  };

  const dataDeletedProducto = (id) => {
    setProductos((prev) => prev.filter((categoria) => categoria.id !== id));
  };

  const dataUpdatedProduct = (id) => {
    setProductos((prev) => prev.filter((producto) => producto.id !== id));
  };
  
  const actualizarDisponibleProductos = (id, newValue) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, disponible: newValue } : producto
      )
    );
  };

  const typeTable = (type) => {
    setDataType((prev) => (prev === type ? "" : type));
  };

  const openModal = (modalName, prod = null) => {
    setActiveModal(modalName), setSelectedProd(prod);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="p-5">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Lista /</span> Productos
        </h1>
        <div className="flex gap-3">
          <button
            className="text-lg bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2 "
            onClick={() => openModal("registrar")}
          >
            <IoMdAddCircle />
            Agregar producto
          </button>
          <button
            className="text-lg bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2"
            onClick={() => openModal("categoria")}
          >
            <IoMdAddCircle />
            Agregar categoria
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 ">
        <CardInforme typeTable={typeTable} productos={productos} />
      </div>
      <TablaProductos
        productos={productos}
        categorias={categorias}
        openModal={openModal}
        dataType={dataType}
        formatoPrecio={formatoPrecio}
        actualizarDisponibleProductos={actualizarDisponibleProductos}
        dataDeletedProducto={dataDeletedProducto}
      
      />
      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar producto</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>
          <FormRegistro categorias={categorias} formatoPrecio={formatoPrecio} recargarDatos={recargarDatos} />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "editar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Editar producto</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>

          <FormUpdate
            selectedProd={selectedProd}
            categorias={categorias}
            formatoPrecio={formatoPrecio}
            dataUpdatedProduct={dataUpdatedProduct}
          />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "categoria" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar categoria</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>
          <Categorias
            categorias={categorias}
            loadingCategorias={loadingCategorias}
            recargarDatos={recargarDatos}
            actualizarCategorias={actualizarCategorias}
          />
        </Modal>
      )}
    </div>
  );
};

export default Productos;
