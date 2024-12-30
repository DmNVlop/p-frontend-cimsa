import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  let isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!isAuthenticated) {
    handleLogout();
  }
  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
