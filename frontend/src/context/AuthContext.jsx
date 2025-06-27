/**
 * Authentication Context Provider
 * 
 * This file manages the global authentication state for the entire application using React Context API.
 * It handles user login/logout state, user role management, and token persistence across browser sessions.
 * 
 * FEATURES:
 * - Persistent authentication state using localStorage
 * - Role-based access control (trainer vs client)
 * - JWT token management for API requests
 * - Global state management using useReducer pattern
 * - Automatic state synchronization with localStorage
 * 
 * USAGE:
 * - Wrap your app with AuthContextProvider to provide auth state to all components
 * - Use useContext(authContext) in any component to access auth state and dispatch actions
 */

import { createContext, useContext, useEffect, useReducer } from "react";

/**
 * Initial Authentication State
 * 
 * Loads existing authentication data from localStorage on app startup.
 * This ensures users stay logged in even after browser refresh or restart.
 * 
 * STATE STRUCTURE:
 * - user: Complete user profile object (name, email, photo, etc.)
 * - role: User type ('trainer' or 'client') for role-based features
 * - token: JWT token for authenticated API requests
 */
const initialState = {
  // Parse user data from localStorage, handle null case safely
  user: localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
};

// Create context with initial state as default value
export const authContext = createContext(initialState);

/**
 * Authentication State Reducer
 * 
 * Manages authentication state transitions using Redux-like pattern.
 * This centralizes all auth state changes and makes them predictable.
 * 
 * @param {Object} state - Current authentication state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} - New authentication state
 */
const authReducer = (state, action) => {
  switch (action.type) {
    
    /**
     * LOGIN_START Action
     * 
     * Resets auth state to null values when login process begins.
     * This clears any previous authentication data before new login.
     */
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };

    /**
     * LOGIN_SUCCESS Action
     * 
     * Updates state with authenticated user data after successful login.
     * Payload should contain user object, JWT token, and user role.
     * 
     * PAYLOAD STRUCTURE:
     * - user: User profile data from API
     * - token: JWT authentication token
     * - role: User role ('trainer' or 'client')
     */
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };

    /**
     * LOGOUT Action
     * 
     * Clears all authentication data when user logs out.
     * This ensures clean state and forces re-authentication for protected routes.
     */
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };

    // Return current state for unknown actions
    default:
      return state;
  }
};

/**
 * Authentication Context Provider Component
 * 
 * Wraps the application to provide authentication state and dispatch function
 * to all child components. Also handles localStorage synchronization.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 */
export const AuthContextProvider = ({ children }) => {
  // Initialize reducer with initial state from localStorage
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * localStorage Synchronization Effect
   * 
   * Automatically saves authentication state to localStorage whenever state changes.
   * This ensures authentication persists across browser sessions and page refreshes.
   * 
   * IMPORTANT: This runs after every state change, so authentication is always
   * synchronized between memory and localStorage.
   */
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("token", state.token);
    localStorage.setItem("role", state.role);
    console.log("AuthContext state updated:", state);
  }, [state]); // Re-run when state changes

  /**
   * Context Provider Value
   * 
   * Provides authentication state and dispatch function to all child components.
   * 
   * AVAILABLE TO CHILD COMPONENTS:
   * - user: Current user profile data
   * - token: JWT token for API authentication
   * - role: User role for conditional rendering/access control
   * - dispatch: Function to trigger auth state changes
   */
  return (
    <authContext.Provider 
      value={{ 
        user: state.user, 
        token: state.token, 
        role: state.role, 
        dispatch 
      }}
    >
      {children}
    </authContext.Provider>
  )
}
