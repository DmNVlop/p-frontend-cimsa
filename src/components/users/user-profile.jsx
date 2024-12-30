import { useState } from "react";
import { Card, Avatar, Typography, Button, Form, Input, Select, Modal, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modal de edición
  const [form] = Form.useForm();

  // Información del usuario simulada
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "",
  });

  // Guardar los cambios del perfil
  const handleSave = (values) => {
    setUser({ ...user, ...values });
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: "center" }}>
            <Avatar size={100} icon={<UserOutlined />} src={user.avatar} style={{ marginBottom: "10px" }} />
            <Text type="secondary" style={{ display: "block" }}>
              {user.role}
            </Text>
          </Col>
          <Col xs={24} sm={18}>
            <Title level={4}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
            <div style={{ marginTop: "20px" }}>
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Modal de edición */}
      <Modal
        title="Editar Perfil"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSave(values);
            })
            .catch((info) => console.error("Error al validar:", info));
        }}>
        <Form form={form} layout="vertical" initialValues={user}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: "Por favor, ingresa tu correo electrónico" },
              { type: "email", message: "Ingresa un correo electrónico válido" },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Rol">
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="Foto de perfil">
            <Input placeholder="URL de tu foto de perfil" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
