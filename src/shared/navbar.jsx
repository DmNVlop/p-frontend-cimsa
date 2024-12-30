import { DatabaseOutlined, LogoutOutlined, MenuUnfoldOutlined, ProfileOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/user-context";
import AuthRoutes from "../components/routes/auth-routes";

function NavbarHeader() {
  const { user } = useUser();
  const location = useLocation(); // Obtiene la ubicación actual
  const navigate = useNavigate();

  // Determina la clave del menú activa basada en la URL
  const currentPath = location.pathname.split("/")[1]; // Obtiene el primer segmento de la ruta
  const activeKey = currentPath || "ordenes";

  const items = [
    {
      key: "ordenes",
      icon: <ProfileOutlined />,
      label: <Link to="/ordenes">Órdenes</Link>,
    },
    {
      key: "materiales",
      icon: <DatabaseOutlined />,
      label: <Link to="/materiales">Materiales</Link>,
    },
    {
      key: "cantos",
      icon: <RobotOutlined />,
      label: <Link to="/cantos">Cantos</Link>,
    },
    user?.role?.name == "Admin" && {
      key: "usuarios",
      icon: <UserOutlined />,
      label: <Link to="/usuarios">Usuarios</Link>,
    }, // Solo muestra "Usuarios" si el rol es Admin
  ].filter(Boolean); // Elimina elementos falsos o nulos
  // ];

  const itemsProfileMenu = [
    {
      label: "Perfil",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => navigate(`/perfil`),
      // disabled: true,
    },
    {
      label: "Cerrar Sessión",
      key: "2",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => handleLogout(),
    },
  ];

  const menuProps = {
    items: itemsProfileMenu,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}>
        <div
          style={{
            flex: 0.9,
            display: "flex",
            height: "100%",
            maxWidth: "auto",
          }}>
          <Link to="/" style={{ height: "100%", display: "flex" }} title="Ir a inicio | Órdenes">
            <img src="/logos/LogoPedidosCIMSA_150_Wh.png" alt="Logo Pedidos CIMSA" style={{ objectFit: "contain" }} />
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          selectedKeys={[activeKey]}
          style={{
            flex: 1,
            whiteSpace: "nowrap",
          }}
        />

        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              {user?.username || "Usuario"}
              <MenuUnfoldOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Header>
      <Content style={{ padding: "24px" }}>
        <AuthRoutes />
      </Content>
    </Layout>
  );
}

export default NavbarHeader;
