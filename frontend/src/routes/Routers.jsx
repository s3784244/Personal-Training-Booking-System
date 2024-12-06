import React from 'react'

import Home from '../pages/Home'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Contact from '../pages/Contact'
import Trainers from '../pages/Trainer/Trainers'
import TrainerDetails from '../pages/Trainer/TrainerDetails'

import {Routes, Route} from 'react-router-dom'



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
    </Routes>
  );
};

export default Routers
