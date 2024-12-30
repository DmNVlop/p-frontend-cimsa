import { useEffect, useState } from "react";
import { Table, Typography, Button, Modal, Form, Input, Select, message, Row, Col } from "antd";

const { Option } = Select;

const API_MATERIALS = "http://localhost:1337/api/materials";
const API_EDGES = "http://localhost:1337/api/cantos";

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMaterials();
    fetchEdges();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_MATERIALS}?populate=*&sort=material:asc`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMaterials(data.data);
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al cargar los materiales: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchEdges = async () => {
    try {
      const response = await fetch(API_EDGES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEdges(data.data);
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al cargar los cantos: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_MATERIALS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        message.success("Material eliminado correctamente");
        fetchMaterials();
      } else {
        const data = await response.json();
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al eliminar el material: ${error.message}`);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    form.setFieldsValue({
      ...material,
      //   canto_por_defecto: material.canto_por_defecto?.documentId || undefined,
      defaultEdge: material.defaultEdge?.documentId || undefined,
    });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingMaterial(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const method = editingMaterial ? "PUT" : "POST";
      const url = editingMaterial ? `${API_MATERIALS}/${editingMaterial.documentId}` : API_MATERIALS;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          data: {
            ...values,
            defaultEdge: values.defaultEdge || null,
            // canto_por_defecto: values.canto_por_defecto || null,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Material ${editingMaterial ? "editado" : "creado"} correctamente`);
        setIsModalVisible(false);
        fetchMaterials();
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al guardar el material: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "Veta",
      dataIndex: "veta",
      key: "veta",
    },
    {
      title: "Espesor",
      dataIndex: "espesor",
      key: "espesor",
    },
    {
      title: "Dimensiones (LxA)",
      render: (text, record) => `${record.largo} x ${record.ancho}`,
    },
    {
      title: "Canto por Defecto",
      dataIndex: ["defaultEdge", "code"],
      key: "defaultEdge",
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
          <Typography.Title level={3}>Gestión de Materiales</Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>
            Añadir Material
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={materials}
        columns={columns}
        rowKey={(record) => record.documentId}
        loading={loading}
        onRow={(record) => ({
          onDoubleClick: () => handleEdit(record),
        })}
      />

      <Modal
        title={editingMaterial ? "Editar Material" : "Añadir Material"}
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
        <Form form={form} layout="vertical" name="materialForm">
          <Form.Item name="material" label="Material" rules={[{ required: true, message: "Por favor, ingresa el material" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="veta"
            label="Veta"
            rules={[{ required: false }, { type: "string", message: "Por favor selecciona una opción válida" }]}>
            <Select allowClear placeholder="Selecciona una veta">
              <Option value="L">L</Option>
              <Option value="A">A</Option>
            </Select>
          </Form.Item>
          <Form.Item name="espesor" label="Espesor" rules={[{ required: true, message: "Por favor, ingresa el espesor" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="largo" label="Largo" rules={[{ required: true, message: "Por favor, ingresa el largo" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ancho" label="Ancho" rules={[{ required: true, message: "Por favor, ingresa el ancho" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="defaultEdge"
            label="Canto por Defecto"
            rules={[{ required: false, message: "Por favor, selecciona el canto por defecto" }]}>
            <Select placeholder="Selecciona un canto">
              {edges.map((edge) => (
                <>
                  <Option key={null} value={null}>
                    {""}
                  </Option>
                  <Option key={edge.documentId} value={edge.documentId}>
                    {edge.code}
                  </Option>
                </>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialList;
