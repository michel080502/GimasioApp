import ViewAsistenciasHoy from "../../components/principal/AsistenciasHoy/ViewAsistenciasHoy";
import CardsPrincipales from "../../components/principal/CardsPrincipales";

import { useEffect, useState } from "react";
import ViewRenovaciones from "../../components/principal/renovaciones/ViewRenovaciones";
import ViewReStock from "../../components/principal/re-stock/ViewReStock";
import clienteAxios from "../../config/axios";

function DashPrincipal() {
  const [view, setView] = useState("asistencias-dia");
  const [loading, setLoading] = useState(true);
  const [membershipsClient, setMembershipsClient] = useState([]);
  const [products, setProducts] = useState([]);

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
    getMemberships();
    getProducts();
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
      />

      {view === "asistencias-dia" && <ViewAsistenciasHoy />}
      {view === "renovaciones" && (
        <ViewRenovaciones membershipsClient={membershipsClient} />
      )}
      {view === "re-stock" && <ViewReStock products={products} />}
    </div>
  );
}

export default DashPrincipal;
