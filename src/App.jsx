import { Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/private-route/private-route";
import OrderList from "./components/orders/orders-list";
import LoginForm from "./components/login/login";
import { Content, Header } from "antd/es/layout/layout";
import { Layout, Menu } from "antd";
import MaterialList from "./components/materials/materials-list";
import EdgeList from "./components/cantos/cantos-list";
import { DatabaseOutlined, ProfileOutlined, RobotOutlined } from "@ant-design/icons";

const App = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return isAuthenticated ? (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: "ordenes",
              icon: <DatabaseOutlined />,
              label: <Link to="/ordenes">Órdenes</Link>,
            },
            {
              key: "materiales",
              icon: <ProfileOutlined />,
              label: <Link to="/materiales">Materiales</Link>,
            },
            {
              key: "cantos",
              icon: <RobotOutlined />,
              label: <Link to="/cantos">Cantos</Link>,
            },
          ]}
        />
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
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
          <Route path="/" element={<Navigate to="/ordenes" replace />} />
          <Route path="*" element={<Navigate to="/ordenes" replace />} />
        </Routes>
      </Content>
    </Layout>
  ) : (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
