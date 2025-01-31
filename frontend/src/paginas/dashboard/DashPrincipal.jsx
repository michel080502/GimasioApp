import ViewAsistenciasHoy from "../../components/principal/AsistenciasHoy/ViewAsistenciasHoy";
import CardsPrincipales from "../../components/principal/CardsPrincipales";

import { useEffect, useState } from "react";
import ViewRenovaciones from "../../components/principal/renovaciones/ViewRenovaciones";
import ViewReStock from "../../components/principal/re-stock/ViewReStock";
import clienteAxios from "../../config/axios";
import ViewProductos from "../../components/principal/ventas/ViewProductos";

function DashPrincipal() {
  const [view, setView] = useState("asistencias-dia");
  const [loading, setLoading] = useState(true);
  const [membershipsClient, setMembershipsClient] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesVisit, setSalesVisit] = useState([]);
  const [salesProduct, setSalesProduct] = useState([]);

  const typeView = (type) => {
    setView((prev) => (prev === type ? "asistencias-dia" : type));
  };

  useEffect(() => {
    const getMemberships = async () => {
      try {
        const { data } = await clienteAxios.get("/membresia/clientes");
        setMembershipsClient(data);
      } catch (error) {
        console.log(error);
        setMembershipsClient([]);
      }
    };
    const getProducts = async () => {
      try {
        const { data } = await clienteAxios("/producto/");
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };
    const getSalesVisit = async () => {
      try {
        const { data } = await clienteAxios.get("/compra/ventas-visitas");
        setSalesVisit(data);
      } catch (error) {
        console.error(error);
        setSalesVisit([]);
      }
    };

    const getSalesProduct = async () => {
      try {
        const { data } = await clienteAxios.get("/compra/ventas-productos");
        setSalesProduct(data);
      } catch (error) {
        console.error(error);
        setSalesProduct([]);
      }
    };
    getMemberships();
    getProducts();
    getSalesVisit();
    getSalesProduct();
    setLoading(false);
  }, []);

  if (loading) return <h1>Cargando......</h1>;
  return (
    <div className="p-2">
      <CardsPrincipales
        typeView={typeView}
        view={view}
        membershipsClient={membershipsClient}
        products={products}
        salesVisit={salesVisit}
        salesProduct={salesProduct}
      />

      {view === "asistencias-dia" && (
        <ViewAsistenciasHoy salesVisit={salesVisit} />
      )}
      {view === "renovaciones" && (
        <ViewRenovaciones membershipsClient={membershipsClient} />
      )}
      {view === "re-stock" && <ViewReStock products={products} />}
      {view === "productos" && <ViewProductos salesProduct={salesProduct} />}
    </div>
  );
}

export default DashPrincipal;
