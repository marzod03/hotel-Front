import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const EliminarHabitacion = ({ habitacionId, onEliminar }) => {
  const token = localStorage.getItem("token");

  const handleEliminar = async () => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la habitación permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/habitaciones/${habitacionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "¡Eliminado!",
        text: "La habitación ha sido eliminada con éxito.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      onEliminar(habitacionId);
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar la habitación.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <button
      onClick={handleEliminar}
      className="btn btn-danger btn-sm"
    >
      🗑 Eliminar
    </button>
  );
};

export default EliminarHabitacion;
