import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select, Button, message, Typography, Row, Col } from "antd";

const { Title } = Typography;
const { Option } = Select;

const API_MATERIALS = "http://localhost:1337/api/materials";
const API_EDGES = "http://localhost:1337/api/cantos";

// Configurar la posición del contenedor de mensajes
message.config({
  top: 76, // Cambia este valor para ajustar la posición vertical
  duration: 2, // Duración en segundos que el mensaje se muestra
  maxCount: 1, // Número máximo de mensajes que se pueden mostrar al mismo tiempo
});

const PieceForm = ({ orderId, onSuccess, initialValues, onSave, onCancel }) => {
  const [materials, setMaterials] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMaterials();
    fetchEdges();
  }, []);

  useEffect(() => {
    // Si se pasan valores iniciales, rellena el formulario
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(API_MATERIALS, {
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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (initialValues) {
        // Si estamos editando, llama a onSave
        await onSave(values);
      } else {
        // Si estamos creando una nueva pieza
        console.log("🚀 ~ handleSubmit ~ values:", values);
        const response = await fetch("http://localhost:1337/api/piezas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            data: {
              ...values,
              pedido: orderId,
            },
          }),
        });

        const data = await response.json();

        if (response.ok) {
          message.success("Pieza añadida correctamente");
          form.resetFields();
          onSuccess(); // Callback para actualizar la lista de piezas en el componente padre
        } else {
          throw new Error(data.error?.message || "Error desconocido");
        }
      }
    } catch (error) {
      message.error(`Error al guardar la pieza: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Title level={3}>{initialValues ? "Editar Pieza" : "Añadir Pieza a la Orden"}</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={8}>
          <Col style={{ minWidth: "174px" }}>
            <Form.Item name="material" label="Material" rules={[{ required: true, message: "Por favor, selecciona un material" }]}>
              <Select placeholder="Selecciona un material" allowClear>
                <Option value={""} key={null}></Option>
                {materials.map((material) => (
                  <Option key={material.documentId} value={material.documentId}>
                    {material.material}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ width: "64px" }}>
            <Form.Item name="veta" label="Veta">
              <Select placeholder="Selecciona la veta" allowClear>
                <Option value={""} key={null}></Option>
                <Option value="L">L</Option>
                <Option value="A">A</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ width: "94px" }}>
            <Form.Item name="largo" label="Largo" rules={[{ required: true, message: "Por favor, ingresa el largo" }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col style={{ width: "94px" }}>
            <Form.Item name="ancho" label="Ancho" rules={[{ required: true, message: "Por favor, ingresa el ancho" }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col style={{ width: "82px" }}>
            <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true, message: "Por favor, ingresa la cantidad" }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col style={{ minWidth: "128px" }}>
            <Form.Item name="cantoL1" label="Canto Largo 1">
              <Select placeholder="Selecciona un canto" allowClear onChange={(value) => form.setFieldsValue({ cantoL1: value || null })}>
                <Option value="" key={null}>
                  Ninguno
                </Option>
                {edges.map((edge) => (
                  <Option key={edge.documentId} value={edge.documentId}>
                    {edge.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ minWidth: "128px" }}>
            <Form.Item name="cantoL2" label="Canto Largo 2">
              <Select placeholder="Selecciona un canto" allowClear onChange={(value) => form.setFieldsValue({ cantoL2: value || null })}>
                <Option value="" key={null}>
                  Ninguno
                </Option>
                {edges.map((edge) => (
                  <Option key={edge.documentId} value={edge.documentId}>
                    {edge.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ minWidth: "128px" }}>
            <Form.Item name="cantoA1" label="Canto Ancho 1">
              <Select placeholder="Selecciona un canto" allowClear onChange={(value) => form.setFieldsValue({ cantoA1: value || null })}>
                <Option value="" key={null}>
                  Ninguno
                </Option>
                {edges.map((edge) => (
                  <Option key={edge.documentId} value={edge.documentId}>
                    {edge.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ minWidth: "128px" }}>
            <Form.Item name="cantoA2" label="Canto Ancho 2">
              <Select placeholder="Selecciona un canto" allowClear onChange={(value) => form.setFieldsValue({ cantoA2: value || null })}>
                <Option value="" key={null}>
                  Ninguno
                </Option>
                {edges.map((edge) => (
                  <Option key={edge.documentId} value={edge.documentId}>
                    {edge.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ textAlign: "right", alignContent: "flex-end", bottom: "1px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {initialValues ? "Guardar Cambios" : "Añadir Pieza"}
              </Button>
              {initialValues && (
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

PieceForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  initialValues: PropTypes.object, // Valores iniciales para edición
  onSave: PropTypes.func, // Callback para guardar cambios
  onCancel: PropTypes.func, // Callback para cancelar la edición
};

export default PieceForm;
