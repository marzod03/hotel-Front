import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Carousel,
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  NavDropdown
} from "react-bootstrap";
import {
  FaCar,
  FaUtensils,
  FaWifi,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSwimmingPool,
  FaSpa,
  FaCocktail
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles.css";
import logo from "../assets/logo.png";
import Mapa from "../components/Mapa";
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;


const Home = () => {
  const [disponibilidad, setDisponibilidad] = useState({});
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [carritoPreview, setCarritoPreview] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [itemsEliminando, setItemsEliminando] = useState([]);


    const habitacionesEnPromocion = habitaciones
      .map(h => {
        const ahora = new Date();
        const activas = h.promociones?.filter(p =>
          new Date(p.inicio) <= ahora && new Date(p.fin) >= ahora
        );
        if (activas?.length) {
          const menor = activas.reduce((min, p) => p.precioPromo < min.precioPromo ? p : min);
          return { ...h, precioPromocion: menor.precioPromo };
        }
        return null;
      })
      .filter(h => h);


useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dispoRes, habitacionesRes] = await Promise.all([
        axios.get(`${API_URL}/api/habitaciones/disponibilidad`),
        axios.get(`${API_URL}/api/habitaciones`),
      ]);

      console.log("Disponibilidad:", dispoRes.data); 
      setDisponibilidad(dispoRes.data);
      setHabitaciones(habitacionesRes.data);
      setLoading(false);
      const carritoGuardado = JSON.parse(localStorage.getItem("carritoHabitaciones")) || [];
      setCarritoPreview(carritoGuardado);


    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar los datos.");
      setLoading(false);
    }
  };

  fetchData();
}, []);
    <div className="bg-danger text-white d-flex justify-content-between align-items-center px-3 py-3" style={{
      fontWeight: 'bold',
      fontSize: '1.2rem'
    }}>
      Carrito ({carritoPreview.length} Item{carritoPreview.length !== 1 && 's'})
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



  const eliminarDelCarrito = (id) => {
  setItemsEliminando((prev) => [...prev, id]);
  setTimeout(() => {
    const nuevoCarrito = carritoPreview.filter(item => item.id !== id);
    setCarritoPreview(nuevoCarrito);
    localStorage.setItem("carritoHabitaciones", JSON.stringify(nuevoCarrito));

    setItemsEliminando((prev) => prev.filter(itemId => itemId !== id));
  }, 300);
};

  return (
    <>
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
            <Nav.Link onClick={() => navigate("/disponibilidad")} className="text-danger">
              Disponibilidad
            </Nav.Link>
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
            <a href="#ubicacion"><FaMapMarkerAlt size={18} /></a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <header className="hero">
        <Carousel fade interval={6000}>
          <Carousel.Item>
            <img className="d-block w-100" src="https://res.cloudinary.com/dyzweiwo8/image/upload/v1747634167/Bar_Lounge_ya29pj.png" alt="Primera imagen" />
            <Carousel.Caption>
              <h1 className="display-3 text-white">Hotel Suspiro</h1>
              <p className="lead text-light">Ubicados en San Felipe, Guanajuato</p>
              <Button className="custom-btn" variant="danger" size="lg" onClick={() => navigate("/disponibilidad")}>
                Ver Disponibilidad
              </Button>

            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src="https://res.cloudinary.com/dyzweiwo8/image/upload/v1747634373/Restaurante_lpejna.png" alt="Tercera imagen" />
            <Carousel.Caption>
              <h1 className="display-3 text-white">Gastronomía Excepcional</h1>
              <p className="lead">Descubre nuestra exquisita oferta culinaria local</p>
              <Button className="custom-btn" variant="danger" size="lg" onClick={() => navigate("/restaurante")}>
                Reservar Mesa
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </header>

<Container className="my-5" id="habitaciones">
  <h2 className="text-center mb-4 text-danger">Tipos de Habitaciones</h2>
  {loading ? (
    <div className="text-center py-5">
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-3">Cargando habitaciones...</p>
    </div>
  ) : error ? (
    <div className="alert alert-danger text-center">{error}</div>
  ) : (
    <Row>
      {habitaciones.map((habitacion) => {
        const hoy = new Date();
        const promocionActiva = habitacion.promociones?.find(
          (p) => new Date(p.inicio) <= hoy && new Date(p.fin) >= hoy
        );

        const precioFinal = promocionActiva?.precioPromo || habitacion.precio;

        return (
          <Col lg={4} md={6} key={habitacion.id} className="mb-4">
            <Card style={{ cursor: "pointer" }} className="service-card h-100">
              <div style={{ overflow: "hidden", position: "relative" }}>
                {promocionActiva && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "red",
                      color: "white",
                      padding: "4px 8px",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      fontSize: "12px",
                      zIndex: 1
                    }}
                  >
                    PROMOCIÓN
                  </div>
                )}
                <Card.Img
                  variant="top"
                  className="habitacion-img"
                  src={habitacion.imagenUrl || "/habitacion-default.jpg"}
                  alt={habitacion.nombre}
                />
              </div>
              <Card.Body className="d-flex flex-column">
              <Card.Title className="fw-bold">{habitacion.nombre}</Card.Title>
              <Card.Text>{habitacion.descripcion}</Card.Text>

              <div className="mt-auto d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    {promocionActiva ? (
                      <>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "gray",
                            marginRight: "8px"
                          }}
                        >
                          ${habitacion.precio}
                        </span>
                        <span className="fw-bold text-danger">
                          ${precioFinal}/noche
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold text-danger">
                        ${habitacion.precio}/noche
                      </span>
                    )}
                  </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{
                        padding: "6px 16px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                      className="custom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/disponibilidad");
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#dc3545")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      Ver disponibilidad
                    </Button>

                </div>

                {promocionActiva && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "green"
                    }}
                  >
                    Válido del{" "}
                    {new Date(promocionActiva.inicio).toLocaleDateString("es-MX")} al{" "}
                    {new Date(promocionActiva.fin).toLocaleDateString("es-MX")}
                  </div>
                )}
              </div>
            </Card.Body>

            </Card>
          </Col>
        );
      })}
    </Row>
  )}
</Container>



{habitacionesEnPromocion.length > 0 && (
  <Container className="my-5" id="promociones">
    <h2 className="text-center mb-4 text-success">Promociones Actuales</h2>
    <Row>
      {habitacionesEnPromocion.map((habitacion) => {
          const hoy = new Date();
          const promocionActiva = habitacion.promociones?.find(
            (p) =>
              new Date(p.inicio) <= hoy && new Date(p.fin) >= hoy
          );
          const precioFinal = promocionActiva ? habitacion.precioPromocion : habitacion.precio;

        return (
          <Col lg={4} md={6} key={habitacion.id} className="mb-4">
            <Card style={{ cursor: "pointer" }} className="service-card h-100">
              <div style={{ overflow: "hidden", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "4px 8px",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    fontSize: "12px",
                    zIndex: 1
                  }}
                >
                  PROMOCIÓN
                </div>
                <Card.Img
                  variant="top"
                  className="habitacion-img"
                  src={habitacion.imagenUrl || "/habitacion-default.jpg"}
                  alt={habitacion.nombre}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{habitacion.nombre}</Card.Title>
                <Card.Text>{habitacion.descripcion}</Card.Text>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div>
                    <div>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                          marginRight: "8px"
                        }}
                      >
                        ${habitacion.precio}
                      </span>
                      <span className="fw-bold text-danger">
                        ${habitacion.precioPromocion}
                      </span>
                    </div>
                    {habitacion.promociones && habitacion.promociones.length > 0 && (
                      <div style={{ fontSize: "0.8rem" }}>
                        Válido del{" "}
                        {new Date(habitacion.promociones[0].inicio).toLocaleDateString("es-MX")} al{" "}
                        {new Date(habitacion.promociones[0].fin).toLocaleDateString("es-MX")}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    style={{
                      padding: "6px 16px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    className="custom-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/disponibilidad");
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#dc3545")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    Ver disponibilidad
                  </Button>


                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  </Container>
)}

      <div className="py-5 bg-light" id="servicios">
        <Container className="my-5">
          <h2 className="text-center mb-5 text-danger">Nuestros Servicios</h2>
          <Row>
            {[{
              icon: <FaCar />,
              title: "Estacionamiento 24 horas",
              text: "Seguridad garantizada con cámaras y vigilancia."
            }, {
              icon: <FaUtensils />,
              title: "Room Service",
              text: "Exquisita gastronomía en tu habitación."
            }, {
              icon: <FaWifi />,
              title: "Wi-Fi Gratuito",
              text: "Alta velocidad en todo el hotel."
            }, {
              icon: <FaSwimmingPool />,
              title: "Piscina Climatizada",
              text: "Temperatura controlada todo el año."
            }, {
              icon: <FaSpa />,
              title: "Spa & Wellness",
              text: "Relájate con tratamientos de alta calidad."
            }, {
              icon: <FaCocktail />,
              title: "Bar & Lounge",
              text: "Cócteles en un ambiente sofisticado."
            }].map((servicio, i) => (
              <Col md={4} className="mb-4" key={i}>
                <Card className="service-card h-100">
                  <Card.Body>
                    <div className="text-danger mb-3" style={{ fontSize: 40 }}>{servicio.icon}</div>
                    <Card.Title>{servicio.title}</Card.Title>
                    <Card.Text>{servicio.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <section className="py-5 text-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://res.cloudinary.com/dyzweiwo8/image/upload/v1747634167/Fachada_snhpre.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <Container className="py-5">
          <h2 className="mb-4">Experiencia Inolvidable Garantizada</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Reserva ahora y disfruta un confort completo en tu estancia.
          </p>
              <Button className="custom-btn" variant="danger" size="lg" onClick={() => navigate("/disponibilidad")}>
                Ver Disponibilidad
              </Button>
        </Container>
      </section>
    <section id="ubicacion" className="bg-light py-5">
      <Container>
        <h2 className="text-center text-danger mb-4">¿Dónde Estamos?</h2>
        <Mapa />
      </Container>
    </section>

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
      Carrito ({carritoPreview.length} Habitacion{carritoPreview.length !== 1 && 'es'})
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
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
    </div>

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
        disabled={loadingCheckout || carritoPreview.length === 0}
        onClick={() => {
          setLoadingCheckout(true);
          setTimeout(() => {
            setLoadingCheckout(false);
            setMostrarPreview(false);
            navigate('/carrito');
          }, 1000);
        }}
      >
        {loadingCheckout ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Cargando...
          </>
        ) : (
          'Checkout'
        )}
      </Button>
    </div>
  </div>
)}






      {/* Footer */}
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
            <Col md={4}>
              <h5>Enlaces Rápidos</h5>
              <ul className="list-unstyled">
                <li><a href="#habitaciones" className="text-danger">Habitaciones</a></li>
                <li><a href="#servicios" className="text-danger">Servicios</a></li>
                <li><a href="#ubicacion" className="text-danger">Ubicación</a></li>
              </ul>
            </Col>
            <Nav.Link
              as="a"
              href="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-danger"
            >
              Administrador
            </Nav.Link>

          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">&copy; 2025 Hotel Suspiro. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>


    </>
    
  );
};

export default Home;
