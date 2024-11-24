import CardsPrincipales from "../../components/cards/CardsPrincipales";
import CardRenovaciones from "../../components/cards/CardRenovaciones";
import { CardLastAssists } from "../../components/cards/CardLastAssists";
function DashPrincipal() {
  return (
    <div className="p-5">
      <CardsPrincipales />
      <div className="my-6 grid grid-cols-3 gap-4">
        <CardRenovaciones />
        <CardLastAssists />
      </div>
    </div>
  );
}

export default DashPrincipal;
