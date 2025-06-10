import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles.css";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const EditarReserva = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reserva, setReserva] = useState(null);
  const [fechaEntrada, setFechaEntrada] = useState(new Date());
  const [fechaSalida, setFechaSalida] = useState(new Date());
  const [status, setStatus] = useState("");

  // Nuevos estados
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  useEffect(() => {
    axios.get(`${API_URL}/api/reservas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const r = res.data;
        setReserva(r);
        setFechaEntrada(new Date(r.fechaEntrada));
        setFechaSalida(new Date(r.fechaSalida));
        setStatus(r.status);

        // Si existe cliente, usar esos datos
        if (r.cliente) {
          setNombre(r.cliente.nombre);
          setApellido(r.cliente.apellido);
          setTelefono(r.cliente.telefono || "");
          setEmail(r.cliente.email || "");
        } else {
          // fallback para compatibilidad
          const partesNombre = (r.nombreCliente || "").split(" ");
          setNombre(partesNombre[0] || "");
          setApellido(partesNombre.slice(1).join(" ") || "");
          setTelefono(r.telefono || "");
          setEmail(r.email || "");
        }
      })
      .catch(() => Swal.fire("Error", "No se pudo cargar la reserva", "error"));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/reservas/${id}`, {
        fechaEntrada,
        fechaSalida,
        status,
        nombre,
        apellido,
        telefono,
        email
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Éxito", "Reserva actualizada correctamente", "success")
        .then(() => navigate("/admin/dashboard"));
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      Swal.fire("Error", "No se pudo actualizar la reserva", "error");
    }
  };

  if (!reserva) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", paddingTop: "50px" }}>
      <div className="container">
        <h2 className="text-center mb-4 text-danger">Editar Reserva</h2>
        <div className="border rounded p-4 bg-white shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Habitaciones</label>
              <input
                type="text"
                value={
                  reserva.reservahabitacion && reserva.reservahabitacion.length > 0
                    ? reserva.reservahabitacion.map(rh => rh.habitacion.nombre).join(", ")
                    : reserva.tipoHabitacion || "N/A"
                }
                disabled
                className="form-control"
              />

            </div>

            <div className="mb-3">
              <label className="fw-bold">Fecha de Entrada</label>
              <DatePicker
                selected={fechaEntrada}
                onChange={(date) => setFechaEntrada(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Fecha de Salida</label>
              <DatePicker
                selected={fechaSalida}
                onChange={(date) => setFechaSalida(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <button type="submit" className="btn btn-danger w-100">
              Actualizar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarReserva;
