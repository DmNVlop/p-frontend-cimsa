import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../../context/user-context";

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true); // Estado para rastrear la carga de datos del usuario
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (user) {
      setIsLoading(false); // Cuando los datos de `user` están listos
    }
  }, [user]);

  if (isLoading) {
    // Mientras esperamos a que el `user` esté disponible, podemos mostrar un indicador de carga
    return <div>Cargando...</div>;
  }

  // Verifica la autenticación y el rol del usuario una vez que los datos están cargados
  if (!isAuthenticated || user?.role?.name !== "Admin") {
    handleLogout();
    return null; // Evita renderizar el contenido mientras rediriges
  }

  return children; // Si todo está correcto, renderiza los hijos
};

PrivateAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateAdminRoute;
