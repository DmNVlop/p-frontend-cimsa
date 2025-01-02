import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import config from "./config";

import LoginForm from "./components/login/login";
import NavbarHeader from "./shared/navbar";

const App = () => {
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Mode: ${config.mode}`);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return isAuthenticated ? (
    <NavbarHeader />
  ) : (
    <Routes>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default App;
