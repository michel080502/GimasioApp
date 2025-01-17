import ViewAsistenciasHoy from "../../components/principal/AsistenciasHoy/ViewAsistenciasHoy";
import CardsPrincipales from "../../components/principal/CardsPrincipales";

import { useState } from "react";
import ViewRenovaciones from "../../components/principal/renovaciones/ViewRenovaciones";
import ViewReStock from "../../components/principal/re-stock/ViewReStock";

function DashPrincipal() {
  const [view, setView] = useState("asistencias-dia");

  const typeView = (type) => {
    setView((prev) => (prev === type ? "asistencias-dia" : type));
  };
  return (
    <div className="p-2">
      <CardsPrincipales typeView={typeView} view={view} />

      {view === "asistencias-dia" && <ViewAsistenciasHoy />}
      {view === "renovaciones" && <ViewRenovaciones />}
      {view === "re-stock" && <ViewReStock />}
    </div>
  );
}

export default DashPrincipal;
