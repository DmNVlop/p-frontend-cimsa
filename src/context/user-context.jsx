import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import fetchUserData from "../components/users/user-fetch-me";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      localStorage.removeItem("token");
    } else {
      fetchUserData().then((userData) => setUser(userData));
    }
  }, [navigate]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext);
