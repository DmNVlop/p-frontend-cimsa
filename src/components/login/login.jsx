import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useState } from "react";

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Nuevo estado para el loading

  const handleSubmit = async (values) => {
    setLoading(true); // Activar loading
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.jwt);
        window.location.href = "/ordenes";
      } else {
        setError(data.error.message || "Error desconocido");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false); // Desactivar loading al finalizar
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 20, textAlign: "center", border: "1px solid #ccc", borderRadius: 8 }}>
        <h1 style={{ marginBottom: 20 }}>Iniciar Sesión</h1>
        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const values = {
              username: formData.get("username"),
              password: formData.get("password"),
            };
            handleSubmit(values);
          }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", textAlign: "left", marginBottom: 5 }}>Usuario</label>
            <input
              type="text"
              name="username"
              style={{ width: "100%", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
              required
              disabled={loading} // Desactivar input mientras está cargando
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", textAlign: "left", marginBottom: 5 }}>Contraseña</label>
            <input
              type="password"
              name="password"
              style={{ width: "100%", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
              required
              disabled={loading} // Desactivar input mientras está cargando
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: loading ? "#ccc" : "#1890ff", // Cambiar color mientras está cargando
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: loading ? "not-allowed" : "pointer", // Cambiar cursor
            }}
            disabled={loading} // Desactivar botón mientras está cargando
          >
            {loading ? (
              <>
                Cargando... <Spin indicator={<LoadingOutlined spin />} size="small" />
              </>
            ) : (
              "Iniciar Sesión"
            )}
            {/* Cambiar texto del botón */}
          </button>
        </form>

        <div
          style={{ marginTop: "2rem", textAlign: "end", display: "flex", flexDirection: "column", fontSize: "0.8rem", color: "lightgray" }}>
          <span>Creado por Prosolid3d</span>
          <span>Todos los derechos Reservados {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
