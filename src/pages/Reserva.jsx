import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import {
  addDays,
  eachDayOfInterval,
  parseISO,
  startOfDay,
  differenceInCalendarDays,
} from "date-fns";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/reservaStyle.css";
import "../assets/datepickerCustom.css";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Reserva = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const habitacionId = queryParams.get("habitacion");
  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(habitacionId || "");
  const [fechasOcupadas, setFechasOcupadas] = useState([]);

  const [rangoFechas, setRangoFechas] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
    },
  ]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/habitaciones`)
      .then((res) => setHabitaciones(res.data))
      .catch((err) => console.error("Error al obtener habitaciones:", err));
  }, []);

const getDiasOcupados = (fechas) =>
  fechas.flatMap(({ start, end }) =>
    eachDayOfInterval({ start, end }).map((d) => startOfDay(d).getTime())
  );

useEffect(() => {
  if (habitacionSeleccionada) {
    axios
      .get(`${API_URL}/api/reservas/fechas-ocupadas?habitacionId=${habitacionSeleccionada}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const rangos = res.data
            .filter((reserva) => reserva.status !== "cancelada")
            .map(({ fechaEntrada, fechaSalida }) => {
              const start = startOfDay(parseISO(fechaEntrada));
              const end = startOfDay(parseISO(fechaSalida));
              return { start, end };
            });
          setFechasOcupadas(getDiasOcupados(rangos));
        } else {
          setFechasOcupadas([]);
        }
      })
      .catch((err) => console.error("Error al obtener fechas ocupadas:", err));
  }
}, [habitacionSeleccionada]);


  const isDateDisabled = (date) =>
    fechasOcupadas.includes(startOfDay(date).getTime());

  const handleReserva = async (e) => {
    e.preventDefault();

    if (!habitacionSeleccionada) {
      setMensaje({
        type: "danger",
        text: "Por favor selecciona una habitación.",
      });
      return;
    }

    const fechaInicio = startOfDay(rangoFechas[0].startDate);
    const fechaFin = startOfDay(rangoFechas[0].endDate);

    if (fechaFin <= fechaInicio) {
      Swal.fire({
        icon: "warning",
        title: "Rango de fechas inválido",
        text: "La fecha de salida debe ser posterior a la de entrada.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const fechasSeleccionadas = eachDayOfInterval({
      start: fechaInicio,
      end: addDays(fechaFin, -1),
    });

    const hayConflicto = fechasSeleccionadas.some(isDateDisabled);

    if (hayConflicto) {
      Swal.fire({
        icon: "error",
        title: "Fechas no disponibles",
        text: "Las fechas seleccionadas ya están ocupadas.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      await axios.post(`${API_URL}/api/reservas`, {
        nombreCliente: cliente,
        telefono,
        email,
        habitacionId: parseInt(habitacionSeleccionada),
        fechaEntrada: fechaInicio.toISOString().split("T")[0],
        fechaSalida: fechaFin.toISOString().split("T")[0],
      });

      setMensaje({ type: "success", text: "Reserva realizada con éxito." });
      navigate("/gracias-reserva");
      setCliente("");
      setTelefono("");
      setEmail("");
    } catch (error) {
      const mensajeError = error.response?.data?.message || "Error al realizar la reserva";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensajeError,
        confirmButtonColor: "#d33",
      });
    }
  };

  const nochesSeleccionadas =
    rangoFechas[0].startDate && rangoFechas[0].endDate
      ? differenceInCalendarDays(
          startOfDay(rangoFechas[0].endDate),
          startOfDay(rangoFechas[0].startDate)
        )
      : 0;

  return (
    <Container className="mt-5">
      <div className="reserva-container">
        <h2 className="reserva-title">Reserva tu Habitación</h2>

        {mensaje && (
          <div
            className={`reserva-alert ${
              mensaje.type === "success"
                ? "reserva-alert-success"
                : "reserva-alert-danger"
            }`}
          >
            {mensaje.text}
          </div>
        )}

        <div className="reserva-form-group">
          <label className="reserva-label">Selecciona una Habitación</label>
          <select
            className="reserva-control reserva-select"
            value={habitacionSeleccionada}
            onChange={(e) => setHabitacionSeleccionada(e.target.value)}
            required
          >
            <option value="">-- Selecciona una habitación --</option>
            {habitaciones.map((habitacion) => (
              <option key={habitacion.id} value={habitacion.id}>
                {habitacion.nombre} - ${habitacion.precio}/noche
              </option>
            ))}
          </select>
        </div>

        <Form onSubmit={handleReserva}>
          <div className="reserva-form-group">
            <label className="reserva-label">Nombre Completo</label>
            <input
              type="text"
              className="reserva-control"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>

          <div className="reserva-form-group">
            <label className="reserva-label">Teléfono</label>
            <input
              type="text"
              className="reserva-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className="reserva-form-group">
            <label className="reserva-label">Correo Electrónico</label>
            <input
              type="email"
              className="reserva-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="reserva-form-group">
            <label className="reserva-label">Selecciona tu Rango de Fechas</label>
            <div className="calendar-container">
              <DatePicker
                selected={rangoFechas[0].startDate}
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    setRangoFechas([{ startDate: dates[0], endDate: dates[1] }]);
                  }
                }}
                startDate={rangoFechas[0].startDate}
                endDate={rangoFechas[0].endDate}
                selectsRange
                inline
                minDate={new Date()}
                excludeDates={fechasOcupadas.map((t) => new Date(t))}
                dayClassName={(date) =>
                  fechasOcupadas.includes(startOfDay(date).getTime())
                    ? "occupied-date"
                    : undefined
                }
              />
            </div>
          </div>

          <div className="nights-info">
            <i className="fas fa-moon"></i> Noches seleccionadas: {nochesSeleccionadas}
          </div>

          <button className="reserva-btn" type="submit">
            <i className="fas fa-check-circle"></i> Confirmar Reserva
          </button>
        </Form>
      </div>
    </Container>
  );
};

export default Reserva;
