import { useState, useEffect } from "react";
import { message } from "antd";
import config from "../config";

const apiUrl = config.apiUrl;
const API_USERS = `${apiUrl}/users?populate[role][fields][0]=name`;

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_USERS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al cargar los usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (user, isEditing) => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_USERS}/${user.id}` : API_USERS;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(`Usuario ${isEditing ? "editado" : "creado"} correctamente`);
        fetchUsers(); // Actualiza la lista
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al guardar el usuario: ${error.message}`);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        message.success("Usuario eliminado correctamente");
        fetchUsers(); // Actualiza la lista
      } else {
        const data = await response.json();
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al eliminar el usuario: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    saveUser,
    deleteUser,
  };
};
