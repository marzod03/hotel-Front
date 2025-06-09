import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const NuevaPromocion = () => {
  const { id } = useParams(); // id de la habitación
  const [precioBase, setPrecioBase] = useState(0);
  const [precioPromo, setPrecioPromo] = useState("");
  const [descuento, setDescuento] = useState("");
  const [inicio, setInicio] = useState(null);
  const [fin, setFin] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_URL}/api/habitaciones`)
      .then((res) => {
        const habitacion = res.data.find((h) => h.id === parseInt(id));
        if (habitacion) {
          setPrecioBase(habitacion.precio);
        }
      })
      .catch((error) => {
        console.error("Error al obtener habitación:", error);
        Swal.fire("Error", "No se pudo cargar la habitación", "error");
      });
  }, [id]);

  useEffect(() => {
    if (descuento && !isNaN(descuento)) {
      const calculado = precioBase - (precioBase * (parseFloat(descuento) / 100));
      setPrecioPromo(calculado.toFixed(2));
    }
  }, [descuento, precioBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (!precioPromo || !inicio || !fin) {
        return Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      }

      if (parseFloat(precioPromo) >= precioBase) {
        return Swal.fire("Precio inválido", "El precio promocional debe ser menor al precio actual", "error");
      }


    try {
      await axios.post(`${API_URL}/api/promociones`, {
        habitacionId: id,
        precioPromo,
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire("Éxito", "Promoción registrada", "success");
      setPrecioPromo("");
      setDescuento("");
      setInicio(null);
      setFin(null);
    } catch (error) {
      console.error("Error al crear promoción:", error);
      Swal.fire("Error", "No se pudo registrar la promoción", "error");
    }
  };

  return (
    <div className="nueva-promocion-container" style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Agregar Promoción a Habitación #{id}</h2>
      <p><strong>Precio actual:</strong> ${precioBase}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Porcentaje de descuento (%)</label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            className="form-control"
            placeholder="Ej. 20"
          />
        </div>

        <div className="form-group mt-2">
          <label>Precio en promoción</label>
          <input
            type="number"
            value={precioPromo}
            onChange={(e) => setPrecioPromo(e.target.value)}
            className="form-control"
            placeholder="Ej. 1200"
          />
        </div>

        <div className="form-group mt-2">
          <label>Fecha de inicio</label>
          <DatePicker
            selected={inicio}
            onChange={(date) => setInicio(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
          />
        </div>

        <div className="form-group mt-2">
          <label>Fecha de fin</label>
          <DatePicker
            selected={fin}
            onChange={(date) => setFin(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Guardar promoción
        </button>
      </form>
    </div>
  );
};

export default NuevaPromocion;
