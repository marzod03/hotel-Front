import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../assets/styles.css";

const AdminLogin = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  import.meta.env.VITE_API_URL;
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/admins/login`, {
        correo,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminNombre", response.data.nombre);
      navigate("/admin/dashboard");
    } catch (error) {
      setMensaje({
        type: "danger",
        text: "Error al iniciar sesión. Verifica tus credenciales.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Card className="admin-login-card">
        <div className="admin-login-header">
          <h2>Panel de Administración</h2>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <div className="admin-login-body">
          {mensaje && (
            <Alert variant={mensaje.type} className="admin-login-alert">
              {mensaje.text}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
              <Form.Label className="admin-form-label">Correo Electrónico</Form.Label>
              <Form.Control
                className="admin-form-control"
                type="email"
                placeholder="admin@hotel.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="admin-form-label">Contraseña</Form.Label>
              <Form.Control
                className="admin-form-control"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="danger"
              type="submit"
              className="admin-login-btn mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </Form>
          <div className="admin-register-link text-center mt-3">
            <p>
              ¿Aún no te registras?{" "}
              <Button variant="link" onClick={() => navigate("/admin/register")}>
                Regístrate aquí
              </Button>
            </p>
          </div>


          <div className="admin-login-footer mt-4">
            <p>© 2025 Hotel Sistema · Panel de Administración</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
