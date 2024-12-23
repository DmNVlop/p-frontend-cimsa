import { DatabaseOutlined, LogoutOutlined, ProfileOutlined, RobotOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/private-route/private-route";
import OrderList from "../components/orders/orders-list";
import MaterialList from "../components/materials/materials-list";
import EdgeList from "../components/cantos/cantos-list";
import UserList from "../components/users/users-list";

function NavbarHeader() {
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
    {
      key: "usuarios",
      icon: <RobotOutlined />,
      label: <Link to="/usuarios">Usuarios</Link>,
    },
  ];

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
          }}>
          <Link to="/" style={{ height: "100%", display: "flex" }}>
            <img src="/logos/LogoPedidosCIMSA_150_Wh.png" alt="Logo Pedidos CIMSA" style={{ objectFit: "contain" }} />
          </Link>
        </div>
        <Menu theme="dark" mode="horizontal" items={items} />
        <Button type="primary" shape="circle" icon={<LogoutOutlined />} size={"large"} onClick={handleLogout} />
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="*" element={<Navigate to="/ordenes" replace />} />
          <Route
            path="/ordenes"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="/materiales"
            element={
              <PrivateRoute>
                <MaterialList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cantos"
            element={
              <PrivateRoute>
                <EdgeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}

export default NavbarHeader;
