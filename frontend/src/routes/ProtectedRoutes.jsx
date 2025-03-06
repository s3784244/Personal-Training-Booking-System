/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * This component ensures that only authenticated users with the correct roles
 * can access certain routes. If the user is not authorized, they will be redirected
 * to the login page.
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The protected content to render if authorized
 * @param {Array} props.allowedRoles - List of roles allowed to access the route
 */
const ProtectedRoutes = ({ children, allowedRoles }) => {
  // Get authentication data (token & role) from the AuthContext
  const { token, role } = useContext(authContext);

  // Check if the user's role is allowed
  const isAllowed = allowedRoles.includes(role);

  // Determine the accessible route:
  // - If the user has a token and their role is allowed, render the children (protected content)
  // - Otherwise, redirect to the login page
  const accessibleRoute =
    token && isAllowed ? children : <Navigate to="/login" replace={true} />;

  console.log("Token:", token);
console.log("Role:", role);

  // Return the appropriate component (protected content or redirect)
  return accessibleRoute;
};

// Export the ProtectedRoute component for use in route protection
export default ProtectedRoutes;