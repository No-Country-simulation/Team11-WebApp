import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../../features/home/pages/HomePage";
import AboutUsPage from "../../features/home/pages/AboutUsPage";
import FinancingPage from "../../features/home/pages/FinancingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<AboutUsPage />} />
        <Route path="/financiamiento" element={<FinancingPage />} />
      </Route>
    </Routes>
  );
}
