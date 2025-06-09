import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UploadImagen from "../components/UploadImagen";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const AdminHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagenUrl: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const obtenerHabitaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/habitaciones`);
      setHabitaciones(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const crearHabitacion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/habitaciones`, nuevaHabitacion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Éxito", "Habitación creada", "success");
      setNuevaHabitacion({ nombre: "", precio: "", descripcion: "", imagenUrl: "" });
      obtenerHabitaciones();
      navigate("/admin/dashboard");
    } catch (error) {
      Swal.fire("Error", "No se pudo crear la habitación", "error");
    }
  };

  const eliminarHabitacion = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/habitaciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Eliminado", "Habitación eliminada", "success");
        obtenerHabitaciones();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
  }, []);

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", paddingTop: "50px" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-danger mb-0">Administrar Habitaciones</h2>

          {/* Opción 1: X para cerrar */}
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999",
            }}
            title="Cerrar"
          >
            ✖
          </button>

          {/* Opción 2: Botón Regresar (si prefieres esto, quita el botón de la X de arriba) */}
          {/*
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            Regresar al Dashboard
          </button>
          */}
        </div>

        <div className="border rounded p-4 bg-white shadow-sm mb-4">
          <h4 className="text-danger mb-3">Crear Nueva Habitación</h4>
          <form onSubmit={crearHabitacion}>
            <input
              type="text"
              placeholder="Nombre"
              className="form-control mb-2"
              value={nuevaHabitacion.nombre}
              onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, nombre: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              className="form-control mb-2"
              value={nuevaHabitacion.precio}
              onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, precio: e.target.value })}
              required
            />
            <textarea
              placeholder="Descripción"
              className="form-control mb-2"
              value={nuevaHabitacion.descripcion}
              onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, descripcion: e.target.value })}
              required
            />
            <UploadImagen onUpload={(url) => setNuevaHabitacion({ ...nuevaHabitacion, imagenUrl: url })} />

            <button className="btn btn-success w-100 mt-3">Crear Habitación</button>
          </form>
        </div>

        <h4 className="text-danger mb-3">Listado de Habitaciones</h4>
        <ul className="list-group">
          {habitaciones.map((h) => (
            <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong className="text-dark">{h.nombre}</strong> - ${h.precio} <br />
                <small className="text-muted">{h.descripcion}</small>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => eliminarHabitacion(h.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminHabitaciones;
