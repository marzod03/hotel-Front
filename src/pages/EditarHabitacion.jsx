import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/ActualizarHabitacion.css";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const EditarHabitacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  useEffect(() => {
    axios.get(`${API_URL}/api/habitaciones`)
      .then((res) => {
        const habitacion = res.data.find((h) => h.id === parseInt(id));
        if (habitacion) {
          setNombre(habitacion.nombre);
          setPrecio(habitacion.precio);
          setDescripcion(habitacion.descripcion);
          setImagenUrl(habitacion.imagenUrl);
        }
      })
      .catch(() => Swal.fire("Error", "No se pudo cargar la habitación", "error"));
  }, [id]);

  const handleFileChange = (e) => {
    setNuevaImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !descripcion) {
      return Swal.fire("Campos requeridos", "Todos los campos son obligatorios", "warning");
    }

    try {
      let urlImagen = imagenUrl;
      if (nuevaImagen) {
        const formData = new FormData();
        formData.append("imagen", nuevaImagen);
        const uploadRes = await axios.post(`${API_URL}/api/upload/habitacion`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        urlImagen = uploadRes.data.url;
      }

      await axios.put(`${API_URL}/api/habitaciones/${id}`, {
        nombre,
        precio,
        descripcion,
        imagenUrl: urlImagen
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Éxito", "Habitación actualizada correctamente", "success")
        .then(() => navigate("/admin/dashboard"));
    } catch (error) {
      console.error("Error al actualizar la habitación:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la habitación", "error");
    }
  };

  return (
    <div className="actualizar-habitacion-container">
      <div className="actualizar-habitacion-card">
        <button
          onClick={() => navigate(-1)}
          style={{
            alignSelf: "flex-end",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer"
          }}
        >
          ❌
        </button>

        <h2 className="actualizar-habitacion-title">Actualizar Habitación</h2>

        <form onSubmit={handleSubmit} className="actualizar-habitacion-form">
          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="actualizar-habitacion-input"
              placeholder="Ejemplo: Habitación Doble"
            />
          </div>

          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="actualizar-habitacion-input"
              placeholder="Ejemplo: 1200"
            />
          </div>

          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="actualizar-habitacion-input"
              placeholder="Describe esta habitación..."
              rows={4}
            />
          </div>

          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Imagen actual</label><br />
            <img src={imagenUrl} alt="habitacion" className="actualizar-habitacion-img" />
          </div>

          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Subir Nueva Imagen</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="actualizar-habitacion-input actualizar-habitacion-file-input"
            />
          </div>

          <button type="submit" className="actualizar-habitacion-submit-btn">
            ACTUALIZAR HABITACIÓN
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="actualizar-habitacion-cancelar-btn"
            style={{
              marginTop: "10px",
              backgroundColor: "#ccc",
              color: "#000",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            CANCELAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarHabitacion;
