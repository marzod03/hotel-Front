import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const GraciasReserva = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    >
      <Container className="text-center bg-white p-5 rounded shadow-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FaCheckCircle size={80} className="text-success mb-3" />
        </motion.div>

        <motion.h1
          className="text-success mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ¡Gracias por tu reserva!
        </motion.h1>

        <motion.p
          className="lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Hemos enviado un correo de confirmación al correo electrónico que proporcionaste.
          Por favor, revisa tu bandeja de entrada o carpeta de spam.
        </motion.p>

        <motion.p
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Esperamos verte pronto en <strong>Hotel Suspiro</strong>.
        </motion.p>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button variant="danger" size="lg" onClick={() => navigate("/")}>Volver al inicio</Button>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default GraciasReserva;
