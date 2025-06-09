import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminHabitaciones from "./pages/AdminHabitaciones";
import AdminReservas from "./pages/AdminReservas";
import Home from "./pages/Home";
import { Link } from "react-router-dom";
import Reserva from "./pages/Reserva";
import CrearHabitacion from "./pages/CrearHabitacion"; 
import EditarHabitacion from "./pages/EditarHabitacion"; 
import EditarReserva from "./pages/EditarReserva";
import GraciasReserva from "./pages/GraciasReserva";
import Restaurante from './pages/Restaurante'; 
import "react-datepicker/dist/react-datepicker.css";
import NuevaPromocion from "./pages/NuevaPromocion";
import Carrito from './pages/carrito'; 
import Disponibilidad from "./pages/DisponibilidadTEEEE";
import AdminRegister from "./pages/AdminRegister";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/habitaciones" element={<AdminHabitaciones />} />
        <Route path="/admin/reservas" element={<AdminReservas />} />
        <Route path="/" element={<Home />} />
        <Route path="/reservar" element={<Reserva />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/habitaciones/crear" element={<CrearHabitacion />} />
        <Route path="/admin/habitaciones/:id" element={<EditarHabitacion />} />
        <Route path="/admin/reservas/:id" element={<EditarReserva />} />
        <Route path="/gracias-reserva" element={<GraciasReserva />} />
        <Route path="/restaurante" element={<Restaurante />} />
        <Route path="/admin/habitaciones/:id/promociones" element={<NuevaPromocion />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />
        <Route path="/admin/register" element={<AdminRegister />} />

      </Routes>
    </Router>
  );
}

export default App;
