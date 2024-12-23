import { Table } from "antd";
import Title from "antd/es/skeleton/Title";
import { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/pedidos?populate=*", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.data));
  }, []);

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Title level={2}>Listado de Órdenes</Title>
      <Table dataSource={orders} columns={columns} rowKey={(record) => record.id} />
    </div>
  );
};

export default OrderList;
