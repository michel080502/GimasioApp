import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Dashboard from "./layout/Dashboard";

import Login from "./paginas/Login";
import Registrar from "./paginas/Registrar";
import OlvidePassword from "./paginas/OlvidePassword";
import ConfirmarCuenta from "./paginas/ConfirmarCuenta";
import NuevoPassword from "./paginas/nuevoPassword";

import DashPrincipal from "./paginas/dashboard/DashPrincipal";
import Clientes from "./paginas/dashboard/Clientes";
import Productos from "./paginas/dashboard/Productos";
import Membresias from "./paginas/dashboard/Membresias";
import { AuthProvider } from "./context/AuthProvider";
import Entrenadores from "./paginas/dashboard/Entrenadores";
import Ventas from "./paginas/dashboard/Ventas";
import Configuracion from "./paginas/dashboard/Configuracion";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
            <Route path="olvide-password" element={<OlvidePassword />} />
            <Route path="olvide-password/:token" element={<NuevoPassword />} />
            <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
          </Route>
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<DashPrincipal />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="membresias" element={<Membresias />} />
            <Route path="productos" element={<Productos />} />
            <Route path="entrenadores" element={<Entrenadores />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
