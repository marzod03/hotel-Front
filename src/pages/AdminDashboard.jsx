import { useEffect, useState } from "react";
import { Container, Button, Table, Navbar, Nav, Badge, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const formatearFecha = (fechaISO) => {
  try {
    const fechaUTC = new Date(fechaISO);
    fechaUTC.setHours(fechaUTC.getHours() + 6);
    return fechaUTC.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Fecha inválida";
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [promoEdit, setPromoEdit] = useState({});
  const token = localStorage.getItem("token");
  const nombreAdmin = localStorage.getItem("adminNombre");

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/admin/login");
    return;
  }

  // Validar que sea válido al hacer la petición
  axios.get(`${API_URL}/api/reservas`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => setReservas(response.data))
    .catch((error) => {
      console.error("Error obteniendo reservas:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminNombre");
        navigate("/admin/login");
      }
    });

  obtenerHabitaciones();
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminNombre");
    navigate("/admin/login");
  };

  const handleEliminarReserva = (reservaId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/reservas/${reservaId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            Swal.fire("Eliminado", "La reserva ha sido eliminada.", "success");
            setReservas(reservas.filter((r) => r.id !== reservaId));
          })
          .catch((error) => {
            console.error("Error al eliminar la reserva:", error);
            Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
          });
      }
    });
  };

  const handleEliminarHabitacion = (habitacionId) => {
    Swal.fire({
      title: "¿Eliminar habitación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/habitaciones/${habitacionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            Swal.fire("Eliminado", "La habitación ha sido eliminada.", "success");
            setHabitaciones(habitaciones.filter((h) => h.id !== habitacionId));
          })
          .catch((error) => {
            console.error("Error al eliminar la habitación:", error);
            Swal.fire("Error", "No se pudo eliminar la habitación.", "error");
          });
      }
    });
  };

  const eliminarPromocion = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/promociones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Eliminado", "Promoción eliminada.", "success");
      obtenerHabitaciones();
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la promoción", "error");
    }
  };

  const editarPromocion = (promo) => {
    setPromoEdit(promo);
    setShowModal(true);
  };

  const guardarEdicionPromocion = async () => {
    try {
      await axios.put(`${API_URL}/api/promociones/${promoEdit.id}`, promoEdit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      obtenerHabitaciones();
      Swal.fire("Actualizado", "Promoción actualizada", "success");
    } catch (error) {
      console.error("Error actualizando promoción:", error);
      Swal.fire("Error", "No se pudo actualizar la promoción", "error");
    }
  };

  const renderEstado = (estado) => {
    if (estado === "confirmada") {
      return <Badge bg="success">RESERVA CONFIRMADA</Badge>;
    } else if (estado === "reservado") {
      return <Badge bg="success" text="white">RESERVADO</Badge>;
    } else {
      return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const obtenerHabitaciones = () => {
    axios
      .get(`${API_URL}/api/habitaciones`)
      .then((response) => setHabitaciones(response.data))
      .catch((error) => console.error("Error obteniendo habitaciones:", error));
  };

  const mostrarPrecio = (habitacion) => {
    const ahora = new Date();
    const activas = habitacion.promociones?.filter(p => new Date(p.inicio) <= ahora && new Date(p.fin) >= ahora);

    if (activas?.length > 0) {
      const menor = activas.reduce((min, p) => p.precioPromo < min.precioPromo ? p : min);
      return (
        <>
          <span style={{ textDecoration: "line-through", color: "gray", marginRight: "5px" }}>
            ${habitacion.precio}
          </span>
          <span style={{ color: "red", fontWeight: "bold" }}>
            ${menor.precioPromo}
          </span>
        </>
      );
    }

    return `${habitacion.precio}`;
  };

  return (
    <div className="admin-dashboard">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Panel de Administración</Navbar.Brand>
          <Nav className="ms-auto">
            <span className="text-white me-3">Hola, {nombreAdmin}</span>
            <Button variant="outline-light" onClick={handleLogout}>Cerrar sesión</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
<h4 className="mb-4 text-danger">Reservas</h4>
<Table striped bordered hover responsive>
  <thead className="table-dark text-center">
    <tr>
      <th>#</th>
      <th>Cliente</th>
      <th>Habitación(es)</th>
      <th>Entrada</th>
      <th>Salida</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {reservas.length > 0 ? (
      reservas.map((reserva, index) => (
        <tr key={reserva.id}>
          <td className="text-center">{index + 1}</td>
          <td>
            {reserva.cliente
              ? `${reserva.cliente.nombre} ${reserva.cliente.apellido}`
              : "Sin cliente"}
          </td>
          <td>
            {reserva.habitaciones && reserva.habitaciones.length > 0 ? (
              <ul className="mb-0 ps-3">
                {reserva.habitaciones.map((h, i) => (
                  <li key={i}>{h.habitacion.nombre}</li>
                ))}
              </ul>
            ) : (
              reserva.tipoHabitacion || "N/A"
            )}
          </td>
          <td>{formatearFecha(reserva.fechaEntrada)}</td>
          <td>{formatearFecha(reserva.fechaSalida)}</td>
          <td>{renderEstado(reserva.status)}</td>
          <td className="text-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/admin/reservas/${reserva.id}`)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleEliminarReserva(reserva.id)}
              >
                Eliminar
              </Button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center text-muted">
          No hay reservas registradas
        </td>
      </tr>
    )}
  </tbody>
</Table>


<h4 className="mt-5 text-danger">Gestión de Habitaciones</h4>
<Table striped bordered hover responsive>
  <thead className="table-dark text-center">
    <tr>
      <th>#</th>
      <th>Nombre</th>
      <th>Precio</th>
      <th>Promociones Activas</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {habitaciones.length > 0 ? (
      habitaciones.map((h, index) => (
        <tr key={h.id}>
          <td className="text-center">{index + 1}</td>
          <td>{h.nombre}</td>
          <td className="fw-bold text-success">${mostrarPrecio(h)}</td>
          <td>
            {h.promociones?.length > 0 ? (
              <Table bordered size="sm" className="mb-0">
                <thead>
                  <tr className="bg-light text-center">
                    <th>Precio</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {h.promociones.map((promo) => (
                    <tr key={promo.id} className="text-center">
                      <td>${promo.precioPromo}</td>
                      <td>{formatearFecha(promo.inicio)}</td>
                      <td>{formatearFecha(promo.fin)}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <Button variant="warning" size="sm" onClick={() => editarPromocion(promo)}>
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => eliminarPromocion(promo.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <span className="text-muted">Sin promociones</span>
            )}
          </td>
          <td className="text-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button variant="primary" size="sm" onClick={() => navigate(`/admin/habitaciones/${h.id}`)}>
                Editar
              </Button>
              <Button variant="success" size="sm" onClick={() => navigate(`/admin/habitaciones/${h.id}/promociones`)}>
                + Promoción
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleEliminarHabitacion(h.id)}>
                Eliminar
              </Button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center text-muted">
          No hay habitaciones registradas
        </td>
      </tr>
    )}
  </tbody>
</Table>
<Button variant="success" className="mb-3" onClick={() => navigate("/admin/habitaciones")}>
  + Agregar Habitación
</Button>

      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Precio Promoción</Form.Label>
              <Form.Control type="number" value={promoEdit.precioPromo || ''} onChange={(e) => setPromoEdit({ ...promoEdit, precioPromo: parseFloat(e.target.value) })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Inicio</Form.Label>
              <Form.Control type="date" value={promoEdit.inicio?.slice(0, 10) || ''} onChange={(e) => setPromoEdit({ ...promoEdit, inicio: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fin</Form.Label>
              <Form.Control type="date" value={promoEdit.fin?.slice(0, 10) || ''} onChange={(e) => setPromoEdit({ ...promoEdit, fin: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicionPromocion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
