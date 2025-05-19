import React from 'react'

import Home from '../pages/Home'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Contact from '../pages/Contact'
import Trainers from '../pages/Trainer/Trainers'
import TrainerDetails from '../pages/Trainer/TrainerDetails'
import MyAccount from '../Dashboard/user-account/MyAccount'
import Dashboard from '../Dashboard/trainer-account/Dashboard'
import {Routes, Route} from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import CheckoutSuccess from '../pages/Trainer/CheckoutSuccess.jsx'

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/trainers" element={<Trainers/>} />
      <Route path="/trainers/:id" element={<TrainerDetails/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Signup/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="/checkout-success" element={<CheckoutSuccess/>} />
      <Route path="/users/profile/me" element={<ProtectedRoutes allowedRoles={['client']}> <MyAccount/> </ProtectedRoutes>} />
      <Route path="/trainers/profile/me" element={ <ProtectedRoutes allowedRoles={['trainer']}><Dashboard/></ProtectedRoutes>} />
    </Routes>
  );
};

export default Routers
