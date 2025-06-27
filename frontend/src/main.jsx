/**
 * Main Entry Point for the React Application
 * 
 * This file is the root of the React application and sets up:
 * - React Router for navigation between pages
 * - Authentication Context for user state management
 * - Toast notifications for user feedback
 * - Global styling and theme configuration
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { AuthContextProvider } from './context/AuthContext.jsx'

// Create root element and render the complete application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Router provider for navigation throughout the app */}
    <BrowserRouter>
      {/* Authentication context provider for user state management */}
      <AuthContextProvider>
        {/* Toast container for displaying notifications */}
        <ToastContainer 
          theme="dark" 
          position='top-right' 
          autoClose={3000} 
          closeOnClick 
          pauseOnHover={false}
        />
        {/* Main application component */}
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
