import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import "../assets/crearHabitacion.css";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const CrearHabitacion = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !precio || !imagen) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("imagen", imagen);

      const uploadRes = await axios.post(`${API_URL}/api/upload/habitacion`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post(`${API_URL}/api/habitaciones`, {
        nombre,
        precio,
        descripcion: "",
        imagenUrl: uploadRes.data.url,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Habitación creada con éxito!");
      setNombre("");
      setPrecio("");
      setImagen(null);
    } catch (error) {
      console.error("Error al crear la habitación:", error);
      alert("Hubo un error al crear la habitación.");
    }
  };

  return (
    <div className="crear-habitacion-container">
      <div className="volver-container">
        <Button variant="link" className="volver-boton" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Volver
        </Button>
      </div>

      <div className="crear-habitacion-card">
        <h2 className="crear-habitacion-title">Crear Nueva Habitación</h2>
        <form onSubmit={handleSubmit} className="crear-habitacion-form">
          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Nombre de Habitación</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="crear-habitacion-input"
              placeholder="Ejemplo: Habitación Doble"
            />
          </div>

          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="crear-habitacion-input"
              placeholder="Ejemplo: 1200"
            />
          </div>

          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Subir Imagen</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="crear-habitacion-input crear-habitacion-file-input"
            />
          </div>

          <button type="submit" className="crear-habitacion-submit-btn">
            Crear Habitación
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearHabitacion;
