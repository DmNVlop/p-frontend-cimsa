import { useEffect, useState } from "react";
import { Table, Typography, Button, Modal, Form, Input, Select, message } from "antd";

const { Title } = Typography;
const { Option } = Select;

const API_USERS = "http://localhost:1337/api/users";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        message.success("Usuario eliminado correctamente");
        fetchUsers();
      } else {
        const data = await response.json();
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al eliminar el usuario: ${error.message}`);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser ? `${API_USERS}/${editingUser.id}` : API_USERS;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Usuario ${editingUser ? "editado" : "creado"} correctamente`);
        setIsModalVisible(false);
        fetchUsers();
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al guardar el usuario: ${error.message}`);
    }
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
      render: (role) => role?.name || "Sin rol",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Title level={2}>Gestión de Usuarios</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Añadir Usuario
      </Button>
      <Table dataSource={users} columns={columns} rowKey={(record) => record.id} loading={loading} />

      <Modal
        title={editingUser ? "Editar Usuario" : "Añadir Usuario"}
        visible={isModalVisible}
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
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item name="username" label="Nombre" rules={[{ required: true, message: "Por favor, ingresa el nombre de usuario" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Por favor, ingresa el email" }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: !editingUser, message: "Por favor, ingresa la contraseña" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Rol" rules={[{ required: true, message: "Por favor, selecciona un rol" }]}>
            <Select placeholder="Selecciona un rol">
              <Option value="admin">Admin</Option>
              <Option value="comercial">Comercial</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
