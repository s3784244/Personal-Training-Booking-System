/**
 * Layout Component
 * 
 * This component defines the overall structure of the application:
 * - Header: Navigation bar with menu items and authentication buttons
 * - Main: Content area where different pages are rendered based on routing
 * - Footer: Site footer with links and company information
 * 
 * This layout is consistent across all pages of the application.
 */

import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Routers from '../routes/Routers'

const Layout = () => {
  return (
    <>
      {/* Site header with navigation */}
      <Header />
      
      {/* Main content area where pages are rendered */}
      <main>
        <Routers/>
      </main>
      
      {/* Site footer */}
      <Footer />
    </>
  )
}

export default Layout
