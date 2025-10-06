import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../../features/home/pages/Home'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}


