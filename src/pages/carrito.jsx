import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form,  Navbar, Nav,} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import Swal from 'sweetalert2';
import logo from "../assets/logo.png";
import { FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    emailConfirmacion: '',
    telefono: '',
    pais: '',
    comentarios: '',
  });
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);
  const [adultos, setAdultos] = useState(2);
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem('carritoHabitaciones')) || [];
    setCarrito(guardado);

    if (guardado.length > 0) {
      const primera = guardado[0];
      if (primera.fechaEntrada) setFechaEntrada(new Date(primera.fechaEntrada));
      if (primera.fechaSalida) setFechaSalida(new Date(primera.fechaSalida));
      if (primera.adultos) setAdultos(primera.adultos);
    }
  }, []);

  const eliminarHabitacion = (id) => {
    const nuevoCarrito = carrito.filter(h => h.id !== id);
    localStorage.setItem('carritoHabitaciones', JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((acc, h) => acc + parseFloat(h.precio), 0);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No hay habitaciones seleccionadas para reservar.',
    });
    return;
  }

  if (!aceptaCondiciones) {
    Swal.fire({
      icon: 'warning',
      title: 'Condiciones no aceptadas',
      text: 'Debes aceptar las condiciones para continuar.',
    });
    return;
  }

  if (datos.email !== datos.emailConfirmacion) {
    Swal.fire({
      icon: 'error',
      title: 'Correo no coincide',
      text: 'Los correos electrónicos no coinciden.',
    });
    return;
  }

  if (!fechaEntrada || !fechaSalida) {
    Swal.fire({
      icon: 'warning',
      title: 'Fechas incompletas',
      text: 'Debes seleccionar las fechas de entrada y salida.',
    });
    return;
  }

  const payload = {
    huesped: {
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      telefono: datos.telefono,
    },
    fechaEntrada: fechaEntrada.toISOString(),
    fechaSalida: fechaSalida.toISOString(),
    habitaciones: carrito.map(h => ({ id: h.id })),
  };

  console.log("📦 Enviando payload:", payload);

  try {
    const response = await axios.post(`${API_URL}/api/reservas`, payload);

    await Swal.fire({
      icon: 'success',
      title: 'Reserva confirmada',
      text: 'Tu reserva ha sido enviada correctamente.',
    });

    localStorage.removeItem('carritoHabitaciones');
    navigate('/');
  } catch (error) {
    console.error("Error al enviar reserva:", error.response?.data || error);

    Swal.fire({
      icon: 'error',
      title: 'Error al reservar',
      text: error.response?.data?.message || 'Hubo un problema al enviar la reserva.',
    });
  }
};


  return (

    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100%" }}>
    <Navbar expand="lg" className="navbar-dark bg-dark">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Hotel Suspiro" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate("/restaurante")} className="text-danger">
              Restaurante
            </Nav.Link>
          </Nav>
          <div className="social-icons d-flex align-items-center ms-3">
            <a href="tel:+520000000000"><FaPhone size={18} /></a>
            <a href="https://wa.me/+520000000000"><FaWhatsapp size={18} /></a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar> 


    <Container className="my-5" >
      <h2 className="text-center mb-4 text-danger">Carrito</h2>

      {/* Selección de fechas y ocupación */}
      <Card className="mb-4 p-3 shadow-sm border">
        <Row className="align-items-end">
          <Col md={4} lg={3} className="mb-3">
            <Form.Label className="fw-bold">Entrada</Form.Label>
            <DatePicker
              selected={fechaEntrada}
              onChange={(date) => setFechaEntrada(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Selecciona fecha"
            />
          </Col>
          <Col md={4} lg={3} className="mb-3">
            <Form.Label className="fw-bold">Salida</Form.Label>
            <DatePicker
              selected={fechaSalida}
              onChange={(date) => setFechaSalida(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Selecciona fecha"
              minDate={fechaEntrada}
            />
          </Col>
          <Col md={4} lg={3} className="mb-3">
            <Form.Label className="fw-bold mb-1">Huéspedes</Form.Label>
            <Form.Select
              value={adultos}
              onChange={(e) => setAdultos(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} huésped{n > 1 ? "es" : ""}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card>

      <Row>
        {/* Formulario del huésped */}
        <Col md={7}>
          <h3 className="text-danger mb-4">Datos del Huésped</h3>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control required value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control required value={datos.apellido} onChange={e => setDatos({ ...datos, apellido: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Email</Form.Label>
                  <Form.Control type="email" required value={datos.emailConfirmacion} onChange={e => setDatos({ ...datos, emailConfirmacion: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control value={datos.telefono} onChange={e => setDatos({ ...datos, telefono: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="He leído y acepto las condiciones generales"
                checked={aceptaCondiciones}
                onChange={() => setAceptaCondiciones(!aceptaCondiciones)}
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100">Confirmar Reserva</Button>
          </Form>
        </Col>

        {/* Resumen del carrito */}
        <Col md={5}>
          <h3 className="text-danger mb-4">Resumen de tu Reserva</h3>

          <p><strong>Entrada:</strong> {fechaEntrada ? fechaEntrada.toLocaleDateString() : 'No seleccionada'}</p>
          <p><strong>Salida:</strong> {fechaSalida ? fechaSalida.toLocaleDateString() : 'No seleccionada'}</p>
          <p><strong>Ocupación:</strong> {adultos} Adulto(s)</p>

          {carrito.length === 0 && (
            <p className="text-muted">No hay habitaciones seleccionadas.</p>
          )}

          {carrito.map((h, i) => (
            <Card className="mb-3" key={i}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="mb-0">{h.nombre}</Card.Title>
                  <small className="text-muted">Tipo: {h.tipo}</small><br />
                  <strong>${h.precio}</strong>
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => eliminarHabitacion(h.id)}>Eliminar</Button>
              </Card.Body>
            </Card>
          ))}
          <hr />
          <h5>Total: <span className="text-success">${total.toFixed(2)}</span></h5>
        </Col>
      </Row>
    </Container>

          <footer className="bg-dark text-white py-5">
            <Container>
              <Row>
                <Col md={4} className="mb-4">
                  <h5>Hotel Suspiro</h5>
                  <p className="text-muted">Hospitalidad excepcional desde 1998.</p>
                </Col>
                <Col md={4} className="mb-4">
                  <h5>Contacto</h5>
                  <ul className="list-unstyled">
                    <li><FaMapMarkerAlt className="me-2 text-danger" /> Allende S/N, San Felipe, Guanajuato</li>
                    <li><FaPhone className="me-2 text-danger" /> +1234567890</li>
                    <li><FaWhatsapp className="me-2 text-danger" /> +1234567890</li>
                  </ul>
                </Col>
              </Row>
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-0">&copy; 2025 Hotel Suspiro. Todos los derechos reservados.</p>
              </div>
            </Container>
          </footer>
    </div>
  );
};

export default Carrito;
