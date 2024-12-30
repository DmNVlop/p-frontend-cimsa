import { Navigate, Route, Routes } from "react-router-dom";

import OrderListView from "../orders/orders-list";
import OrderDetail from "../orders/order-details";
import MaterialList from "../materials/materials-list";
import EdgeList from "../cantos/cantos-list";
import UserListView from "../users/users-list";

import PrivateAdminRoute from "./private-route/private-admin-route";
import PrivateRoute from "./private-route/private-route";
import UserProfile from "../users/user-profile";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/ordenes" replace />} />
      <Route
        path="/ordenes"
        element={
          <PrivateRoute>
            <OrderListView />
          </PrivateRoute>
        }
      />
      <Route path="/ordenes/:id" element={<OrderDetail />} />
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
          <PrivateAdminRoute>
            <UserListView />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default AuthRoutes;
