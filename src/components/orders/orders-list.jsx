import { useEffect, useState } from "react";
import { Button, Table, Typography, Modal, Form, Input, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useUser } from "../../context/user-context";
import { useOrders } from "../../hooks/useOrders";
import Loading from "../../shared/loading";

const OrderListView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { orders, loading, createOrder, formatDate, findOrderByCode } = useOrders();
  const [loadingMessage, setLoadingMessage] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Leer los parámetros de la URL
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("c"); // Valor del parámetro 'c'
  const orderName = searchParams.get("n"); // Valor del parámetro 'n'

  useEffect(() => {
    const handleOrderCode = async () => {
      if (orderCode) {
        try {
          setLoadingMessage("Verificando Número de Pedido...");

          // Buscar si la orden existe
          const existingOrder = await findOrderByCode(orderCode);

          if (existingOrder) {
            navigate(`/ordenes/${existingOrder.documentId}`);
            return;
          }

          setLoadingMessage("Creando pedido...");
          const { data } = await createOrder({ code: orderCode, nombre: orderName });
          navigate(data?.documentId ? `/ordenes/${data.documentId}` : "/ordenes");
        } catch (error) {
          console.error("Error manejando la orden:", error);
        }
      }
    };

    handleOrderCode();
  }, [orderCode]);

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
      title: "Num. Piezas",
      key: "numeroDePiezas",
      dataIndex: "numeroDePiezas",
      // render: (text, record) => record.piezas?.length || 0,
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "Modificado",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => formatDate(updatedAt),
    },
    {
      title: "Acciones",
      render: (text, record) => <Button onClick={() => navigate(`/ordenes/${record.documentId}`)}>Ver Detalle</Button>,
    },
  ];

  const handleCreateOrder = (values) => {
    createOrder(values).then(() => setIsModalVisible(false));
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <Loading loadingMessage={loadingMessage} />}

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography.Title level={3}>Listado de Órdenes</Typography.Title>
        {user?.role?.name === "Admin" && (
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Crear Orden
          </Button>
        )}
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey={(record) => record.documentId}
        loading={loading}
        onRow={(record) => ({
          onDoubleClick: () => navigate(`/ordenes/${record.documentId}`),
        })}
      />

      <Modal title="Crear Nueva Orden" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item name="code" label="Código" rules={[{ required: true, message: "Por favor, ingresa el código de la orden" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Por favor, ingresa el nombre de la orden" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: "1rem" }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Crear
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderListView;
