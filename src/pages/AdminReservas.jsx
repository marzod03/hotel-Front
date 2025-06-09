import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;


const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const token = localStorage.getItem("token");

  const obtenerReservas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reservas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(
        `${API_URL}/api/reservas/${id}`,
        { status: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Actualizado", "El estado fue cambiado", "success");
      obtenerReservas();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const eliminarReserva = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/reservas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Eliminado", "Reserva eliminada", "success");
        obtenerReservas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Reservas</h3>
      <ul className="list-group">
        {reservas.map((reserva) => (
          <li key={reserva.id} className="list-group-item">
            <strong>{reserva.nombreCliente}</strong> – {reserva.tipoHabitacion}
            <br />
            Del <b>{new Date(reserva.fechaEntrada).toLocaleDateString()}</b> al <b>{new Date(reserva.fechaSalida).toLocaleDateString()}</b>
            <br />
            Estado: <b>{reserva.status}</b>
            <br />
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-success me-2"
                onClick={() => cambiarEstado(reserva.id, "confirmada")}
              >
                Confirmar
              </button>
              <button
                className="btn btn-sm btn-outline-warning me-2"
                onClick={() => cambiarEstado(reserva.id, "cancelada")}
              >
                Cancelar
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => eliminarReserva(reserva.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReservas;
