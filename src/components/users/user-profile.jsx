import { useState } from "react";
const { Title, Text } = Typography;
const { Option } = Select;
import { Card, Avatar, Typography, Button, Form, Input, Select, Modal, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "../../context/user-context";
import { USER_ROLES } from "../../common/common-variables";

const UserProfile = () => {
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Guardar los cambios del perfil
  const handleSave = (values) => {
    // setUser({ ...user, ...values });
    // setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: "center" }}>
            <Avatar size={100} icon={<UserOutlined />} src={""} style={{ marginBottom: "10px" }} />
            <Text type="secondary" style={{ display: "block" }}>
              {user?.role?.name || "Rol"}
            </Text>
          </Col>
          <Col xs={24} sm={18}>
            <Title level={4}>{user?.username || "Usuario"}</Title>
            <Text type="secondary">{user?.email || "Correo Electrónico"}</Text>
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
          <Form.Item name="username" label="Nombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
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
              <Option value={USER_ROLES.Admin.role}>{USER_ROLES.Admin.name}</Option>
              <Option value={USER_ROLES.Comercial.role}>{USER_ROLES.Comercial.name}</Option>
            </Select>
          </Form.Item>
          {/* <Form.Item name="avatar" label="Foto de perfil">
            <Input placeholder="URL de tu foto de perfil" />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
