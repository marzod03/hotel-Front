import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const UploadImagen = ({ onUpload }) => {
  const [cargando, setCargando] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargando(true);
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/upload/habitacion`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      onUpload(res.data.url);
    } catch (error) {
      alert("Error al subir imagen");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Subir imagen (Cloudinary)</label>
      <input type="file" className="form-control" onChange={handleChange} accept="image/*" />
      {cargando && <p>Cargando imagen...</p>}
    </div>
  );
};

export default UploadImagen;
