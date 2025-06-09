import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
  Navbar,
  Nav,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles.css";
import { FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Disponibilidad = () => {
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionesOriginales, setHabitacionesOriginales] = useState([]);
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);
  const [adultos, setAdultos] = useState(2);
  const [loadingReserva, setLoadingReserva] = useState(false);

  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [carritoPreview, setCarritoPreview] = useState(() => {
    return JSON.parse(localStorage.getItem("carritoHabitaciones")) || [];
  });
  const [itemsEliminando, setItemsEliminando] = useState([]);

  const filtrarHabitacionesDisponibles = (ocupadas) => {
    const disponibles = habitacionesOriginales.filter(h => !ocupadas.includes(h.id));
    setHabitaciones(disponibles);
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/habitaciones`)
      .then((res) => {
        console.log("HABITACIONES CON PROMO:", res.data);
        setHabitaciones(res.data);
        setHabitacionesOriginales(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (fechaEntrada && fechaSalida) {
      axios.get(`${API_URL}/api/habitaciones/fechas-ocupadas`, {
        params: {
          fechaEntrada: fechaEntrada.toISOString(),
          fechaSalida: fechaSalida.toISOString(),
        },
      })
        .then((res) => {
          console.log("🔎 Habitaciones ocupadas:", res.data.ocupadas);
          filtrarHabitacionesDisponibles(res.data.ocupadas);
        })
        .catch((err) => console.error(err));
    } else {
      setHabitaciones(habitacionesOriginales);
    }
  }, [fechaEntrada, fechaSalida, habitacionesOriginales]);

  const agregarAlCarrito = (habitacion) => {
    const carritoActual = JSON.parse(localStorage.getItem("carritoHabitaciones")) || [];

    const nuevaHabitacion = {
      id: habitacion.id,
      tipo: habitacion.tipoHabitacion ? habitacion.tipoHabitacion.toLowerCase() : "sin_tipo",
      nombre: habitacion.nombre,
      precio: habitacion.promocionActiva ? habitacion.precioDescuento : habitacion.precio,
      imagenUrl: habitacion.imagenUrl || "/habitacion-default.jpg",
      fechaEntrada,
      fechaSalida,
      adultos,
    };

    carritoActual.push(nuevaHabitacion);
    localStorage.setItem("carritoHabitaciones", JSON.stringify(carritoActual));

    setCarritoPreview(carritoActual);
    setMostrarPreview(true);
  };

  const eliminarDelCarrito = (id) => {
    setItemsEliminando((prev) => [...prev, id]);
    setTimeout(() => {
      const nuevoCarrito = carritoPreview.filter(item => item.id !== id);
      setCarritoPreview(nuevoCarrito);
      localStorage.setItem("carritoHabitaciones", JSON.stringify(nuevoCarrito));

      setItemsEliminando((prev) => prev.filter(itemId => itemId !== id));
    }, 300);
  };

  const formatFecha = (fecha) => {
    return fecha ? format(new Date(fecha), "dd 'de' MMMM yyyy") : "";
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
            <Button
              variant="outline-light"
              className="ms-2"
              onClick={() => setMostrarPreview(true)}
            >
              🛒 Ver Carrito
            </Button>
          </Nav>
          <div className="social-icons d-flex align-items-center ms-3">
            <a href="tel:+520000000000"><FaPhone size={18} /></a>
            <a href="https://wa.me/+520000000000"><FaWhatsapp size={18} /></a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar> 

      <Container>
        <h2 className="text-center text-danger mb-5" >Consulta Disponibilidad</h2>
        <div className="border rounded p-4 mb-5 bg-white shadow-sm">
          <Row className="align-items-center">
            <Col md={6} lg={6} className="mb-3">
              <label className="fw-bold mb-1">Seleccionar fechas</label>
              <InputGroup className="d-flex">
                <DatePicker
                  selected={fechaEntrada}
                  onChange={(date) => setFechaEntrada(date)}
                  selectsStart
                  startDate={fechaEntrada}
                  endDate={fechaSalida}
                  placeholderText="Entrada"
                  className="form-control me-2"
                />
                <DatePicker
                  selected={fechaSalida}
                  onChange={(date) => setFechaSalida(date)}
                  selectsEnd
                  startDate={fechaEntrada}
                  endDate={fechaSalida}
                  minDate={fechaEntrada}
                  placeholderText="Salida"
                  className="form-control"
                />
              </InputGroup>
              <div className="text-muted mt-1">
                {fechaEntrada && fechaSalida ? `${format(fechaEntrada, "EEE, d MMM")} — ${format(fechaSalida, "EEE, d MMM")}` : "Fechas no seleccionadas"}
              </div>
            </Col>
            <Col md={4} lg={3} className="mb-3">
              <label className="fw-bold mb-1">Huéspedes</label>
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
        </div>

        {loadingReserva && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-2">Procesando reserva...</p>
          </div>
        )}
        {habitaciones.length === 0 && (
          <div
            className="text-center my-5 animate__animated animate__fadeIn animate__zoomIn"
            style={{
              padding: "40px",
              border: "2px dashed #dc3545",
              borderRadius: "10px",
              backgroundColor: "#fff5f5",
              color: "#dc3545",
              fontSize: "1.8rem", 
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            😢 No hay habitaciones disponibles para las fechas seleccionadas.
            <p style={{
              fontSize: "1.2rem",  
              marginTop: "10px",
              color: "#555"
            }}>
              Por favor intenta con otras fechas para comprobar disponibilad.
            </p>
          </div>
        )}
        {!loadingReserva && (
          <Row>
            {habitaciones.map((habitacion) => (
              <Col md={6} lg={4} key={habitacion.id} className="mb-4">
                <Card className={`shadow-sm ${habitacion.promocionActiva ? "border-danger" : ""}`}>
                  <Card.Img
                    variant="top"
                    className="habitacion-img"
                    src={habitacion.imagenUrl || "/habitacion-default.jpg"}
                    alt={habitacion.nombre}
                  />
                  <Card.Body>
                    <Card.Title className="text-danger fw-bold d-flex justify-content-between align-items-center">
                      {habitacion.nombre}
                      {habitacion.promocionActiva && (
                        <Badge bg="danger">Promoción</Badge>
                      )}
                    </Card.Title>
                    <Card.Text>
                      {habitacion.descripcion}<br />
                      <strong>Capacidad:</strong> {habitacion.capacidad} personas<br />
                      {habitacion.promocionActiva ? (
                        <>
                          <div>
                            <del className="text-muted">${habitacion.precio}</del> <span className="text-success fw-bold fs-5">${habitacion.precioDescuento} MXN</span>
                          </div>
                          {habitacion.promocionFin && (
                            <div className="text-muted small">Válido hasta el {formatFecha(habitacion.promocionFin)}</div>
                          )}
                        </>
                      ) : (
                        <strong className="text-success fs-5">Precio: ${habitacion.precio} MXN por noche</strong>
                      )}
                    </Card.Text>
                    <Button
                      variant="danger"
                      className="w-100"
                      onClick={() => agregarAlCarrito(habitacion)}
                      disabled={!fechaEntrada || !fechaSalida}
                    >
                      Agregar al carrito
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Preview flotante del carrito */}
        {mostrarPreview && (
          <div style={{
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100%',
            width: '400px',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            transform: mostrarPreview ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#343a40',
              color: '#fff',
              padding: '16px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              Carrito ({carritoPreview.length} Habitación{carritoPreview.length !== 1 ? "es" : ""})
              <button
                onClick={() => setMostrarPreview(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✖
              </button>
            </div>

            {/* Lista de items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px'
            }}>
              {carritoPreview.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                carritoPreview.map((habitacion, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                      borderBottom: '1px solid #ddd',
                      paddingBottom: '12px',
                      opacity: itemsEliminando.includes(habitacion.id) ? 0 : 1,
                      transform: itemsEliminando.includes(habitacion.id) ? 'translateX(50px)' : 'translateX(0)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                  >
                    <img
                      src={habitacion.imagenUrl}
                      alt={habitacion.nombre}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginRight: '12px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{habitacion.nombre}</p>
                      <p style={{ margin: '4px 0' }}>${habitacion.precio}/noche</p>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        ${habitacion.precio}
                      </div>
                      <button
                        onClick={() => eliminarDelCarrito(habitacion.id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #ddd'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontWeight: 'bold'
              }}>
                <span>Subtotal</span>
                <span>
                  ${carritoPreview.reduce((acc, item) => acc + item.precio, 0).toFixed(2)}
                </span>
              </div>

              <Button
                variant="danger"
                className="w-100 mb-2"
                disabled={carritoPreview.length === 0}
                onClick={() => {
                  setMostrarPreview(false);
                  navigate('/carrito');
                }}
              >
                Ir al carrito
              </Button>
            </div>
          </div>
        )}
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

export default Disponibilidad;
