import { useEffect, useState } from "react";
import { Table, Typography, Button, Modal, Form, Input, message, Row, Col } from "antd";

const { Title } = Typography;

const EdgeList = () => {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEdge, setEditingEdge] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEdges();
  }, []);

  const fetchEdges = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:1337/api/cantos?sort=code:asc", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setEdges(data.data);
    } catch (error) {
      message.error("Error al cargar los cantos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:1337/api/cantos/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Canto eliminado correctamente");
      fetchEdges();
    } catch (error) {
      message.error("Error al eliminar el canto");
    }
  };

  const handleEdit = (edge) => {
    setEditingEdge(edge);
    form.setFieldsValue(edge);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingEdge(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const method = editingEdge ? "PUT" : "POST";
      const url = editingEdge ? `http://localhost:1337/api/cantos/${editingEdge.documentId}` : "http://localhost:1337/api/cantos";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ data: values }),
      });

      message.success(`Canto ${editingEdge ? "editado" : "creado"} correctamente`);
      setIsModalVisible(false);
      fetchEdges();
    } catch (error) {
      message.error("Error al guardar el canto");
    }
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Espesor",
      dataIndex: "espesor",
      key: "espesor",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.documentId)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <Title level={3}>Gestión de Cantos</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>
            Añadir Canto
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={edges}
        columns={columns}
        rowKey={(record) => record.documentId}
        loading={loading}
        onRow={(record) => ({
          onDoubleClick: () => handleEdit(record),
        })}
      />

      <Modal
        title={editingEdge ? "Editar Canto" : "Añadir Canto"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleSubmit(values);
            })
            .catch((info) => {
              console.error("Validate Failed:", info);
            });
        }}>
        <Form form={form} layout="vertical" name="edgeForm">
          <Form.Item name="code" label="Código" rules={[{ required: true, message: "Por favor, ingresa el código" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Por favor, ingresa la descripción" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="espesor" label="Espesor" rules={[{ required: true, message: "Por favor, ingresa el espesor" }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EdgeList;
