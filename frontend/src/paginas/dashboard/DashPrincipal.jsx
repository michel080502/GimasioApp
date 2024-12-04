import CardsPrincipales from "../../components/cards/CardsPrincipales";
import CardRenovaciones from "../../components/cards/CardRenovaciones";
import { CardLastAssists } from "../../components/cards/CardLastAssists";
function DashPrincipal() {
  return (
    <div className="p-2">
      <CardsPrincipales />
      <div className="p-3 grid grid-cols-1 gap-y-3 md:grid-cols-3 md:gap-4">
        <CardRenovaciones />
        <CardLastAssists />
      </div>
    </div>
  );
}

export default DashPrincipal;
