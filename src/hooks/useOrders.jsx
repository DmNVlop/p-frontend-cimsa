import { useState, useEffect } from "react";
import { message } from "antd";
import config from "../config";

const apiUrl = config.apiUrl;
const API_ORDERS = `${apiUrl}/pedidos`;

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ORDERS}?populate[piezas][fields][0]=documentId&sort=updatedAt:desc`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.data);
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al cargar las órdenes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(API_ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ data: values }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Orden creada correctamente");
        fetchOrders(); // Actualiza las órdenes
        return data;
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al crear la orden: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const findOrderByCode = async (code) => {
    try {
      const response = await fetch(`${API_ORDERS}?filters[code][$eq]=${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("🚀 ~ findOrderByCode ~ response:", response);
      const data = await response.json();
      console.log("🚀 ~ findOrderByCode ~ data:", data);
      if (response.ok) {
        return data.data[0];
      }
      return;
      // else {
      //   throw new Error(data.error?.message || "Error desconocido");
      // }
    } catch (error) {
      message.error(`Error al buscar la orden: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    createOrder,
    formatDate,
    findOrderByCode,
  };
};
