import { useState } from "react";
import { Table, Typography, Button, Modal, Form, Input, Select, Row, Col } from "antd";
import { useUsers } from "./../../hooks/useUsersComp";
import { USER_ROLES } from "../../common/common-variables";

const { Title } = Typography;
const { Option } = Select;

const UserListView = () => {
  const { users, loading, saveUser, deleteUser } = useUsers();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({ ...user, password: "" });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.setFieldsValue({ username: "", email: "", password: "", role: "" });
    // form.resetFields();
    setIsModalVisible(true);
    console.log("🚀 ~ handleAdd ~ form:", form.getFieldValue());
  };

  const handleSubmit = (values) => {
    saveUser(values, !!editingUser).then(() => setIsModalVisible(false));
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => USER_ROLES[role?.name]?.name || "Sin rol",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => deleteUser(record.id)}>
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
          <Title level={3}>Gestión de Usuarios</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>
            Añadir Usuario
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={users}
        columns={columns}
        rowKey={(record) => record.id}
        loading={loading}
        onRow={(record) => ({
          onDoubleClick: () => handleEdit(record),
        })}
      />

      <Modal
        title={editingUser ? "Editar Usuario" : "Añadir Usuario"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Limpia el formulario al cerrar el modal
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields(); // Limpia el formulario después de la validación
              handleSubmit(values);
            })
            .catch((info) => console.error("Error al validar:", info));
        }}>
        <Form
          form={form}
          layout="vertical"
          name="userForm"
          initialValues={editingUser || { username: "", email: "", password: "", role: "" }}>
          <Form.Item name="username" label="Nombre" rules={[{ required: true, message: "Por favor, ingresa el nombre de usuario" }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Por favor, ingresa el email" }]}>
            <Input type="email" autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: !editingUser, message: "Por favor, ingresa la contraseña" }]}>
            <Input.Password autoComplete="off" />
          </Form.Item>
          <Form.Item name="role" label="Rol" rules={[{ required: true, message: "Por favor, selecciona un rol" }]}>
            <Select placeholder="Selecciona un rol">
              <Option value={USER_ROLES.Admin.role}>{USER_ROLES.Admin.name}</Option>
              <Option value={USER_ROLES.Comercial.role}>{USER_ROLES.Comercial.name}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListView;
