import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import "../assets/restauranteStyle.css";
import logo from "../assets/logo.png";

const Restaurante = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [horario, setHorario] = useState("");
  const [personas, setPersonas] = useState(1);
  const [nombre, setNombre] = useState("");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  const backgroundImages = [
    "/restaurant-bg1.png",
    "/restaurant-bg2.jpg",
    "/restaurant-bg3.jpg",
    "/restaurant-bg4.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const horariosDisponibles = {
    desayuno: "9:00am - 12:00pm",
    comida: "3:00pm - 6:00pm",
    cena: "8:00pm - 11:00pm",
  };

  const handleReserva = (e) => {
    e.preventDefault();
    if (horario && personas > 0 && nombre.trim()) {
      setReservaConfirmada(true);
      setTimeout(() => setReservaConfirmada(false), 100000);
    }
  };

  return (
    <div
      className="restaurante-container"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        transition: "background-image 1.5s ease-in-out",
      }}
    >
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
              Habitaciones
            </Nav.Link>
          </Nav>
          <div className="social-icons d-flex align-items-center ms-3">
            <a href="tel:+520000000000"><FaPhone size={18} /></a>
            <a href="https://wa.me/+520000000000"><FaWhatsapp size={18} /></a>
            <a href="#ubicacion"><FaMapMarkerAlt size={18} /></a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <div className="content-wrapper">

        <Container className="my-5" id="form-reserva">
          <h2 className="text-center mb-4 animate__animated animate__fadeInDown text-white display-4">
            Reserva tu mesa
          </h2>

          <Form
            onSubmit={handleReserva}
            className="bg-light p-4 rounded shadow animate__animated animate__fadeInUp"
          >
            <Form.Group className="mb-3">
              <Form.Label>A nombre de</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Horario</Form.Label>
              <Form.Select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              >
                <option value="">Selecciona un horario</option>
                <option value="desayuno">
                  Desayuno (9:00am - 12:00pm)
                </option>
                <option value="comida">Comida (3:00pm - 6:00pm)</option>
                <option value="cena">Cena (8:00pm - 11:00pm)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número de personas</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={personas}
                onChange={(e) => setPersonas(Number(e.target.value))}
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100">
              Confirmar Reserva
            </Button>
            {reservaConfirmada && (
              <Alert variant="success" className="mt-3 text-center">
                Reserva confirmada para <strong>{nombre}</strong> a la hora del{" "}
                <strong>{horario}</strong> (
                {horariosDisponibles[horario]}) para{" "}
                <strong>{personas}</strong> persona(s).
              </Alert>
            )}
          </Form>
        </Container>

        

        <footer className="bg-dark text-white py-5">
          <Container>
            <Row>
              <Col md={4} className="mb-4">
                <h5>Hotel Suspiro</h5>
                <p className="text-muted">
                  Hospitalidad excepcional desde 1998.
                </p>
              </Col>
              <Col md={4} className="mb-4">
                <h5>Contacto</h5>
                <ul className="list-unstyled">
                  <li>
                    <FaMapMarkerAlt className="me-2 text-danger" /> Allende S/N,
                    San Felipe, Guanajuato
                  </li>
                  <li>
                    <FaPhone className="me-2 text-danger" /> +1234567890
                  </li>
                  <li>
                    <FaWhatsapp className="me-2 text-danger" /> +1234567890
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h5>Enlaces Rápidos</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#form-reserva" className="text-danger">
                      Reservar Mesa
                    </a>
                  </li>
                  <li>
                    <a href="#contacto" className="text-danger">
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a href="#ubicacion" className="text-danger">
                      Ubicación
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
            <hr className="my-4" />
            <div className="text-center">
              <p className="mb-0">
                &copy; 2025 Hotel Suspiro. Todos los derechos reservados.
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default Restaurante;
