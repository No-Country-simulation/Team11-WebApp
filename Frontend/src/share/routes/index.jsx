import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../../features/home/pages/HomePage";
import AboutUsPage from "../../features/home/pages/AboutUsPage";
import FinancingPage from "../../features/home/pages/FinancingPage";
import OperatorLayout from "../layouts/OperatorLayout";
import OperatorHomePage from "../../features/operator/pages/OperatorHomePage";
import OperatorRequestsManagePage from "../../features/operator/pages/OperatorRequestsManagePage";
import OperatorReportsPage from "../../features/operator/pages/OperatorReportsPage";
import OperatorRequestsHistoryPage from "../../features/operator/pages/OperatorRequestsHistoryPage";
import PymeLayout from "../layouts/PymeLayout";
import PymeHomePage from "../../features/pyme/pages/PymeHomePage";
import PymeMyRequestsPage from "../../features/pyme/pages/PymeMyRequestsPage";
import PymeDocumentationPage from "../../features/pyme/pages/PymeDocumentationPage";
import PymeCreditHistoryPage from "../../features/pyme/pages/PymeCreditHistoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<AboutUsPage />} />
        <Route path="/financiamiento" element={<FinancingPage />} />
      </Route>

      <Route path="/panel" element={<PymeLayout />}>
        <Route index element={<PymeHomePage />} />
        <Route path="mis-solicitudes" element={<PymeMyRequestsPage />} />
        <Route path="documentacion" element={<PymeDocumentationPage />} />
        <Route path="historial-credito" element={<PymeCreditHistoryPage />} />
      </Route>

      <Route path="/operador/panel" element={<OperatorLayout />}>
        <Route index element={<OperatorHomePage />} />
        <Route path="gestion-solicitudes" element={<OperatorRequestsManagePage />} />
        <Route path="reportes" element={<OperatorReportsPage />} />
        <Route path="historial-solicitudes" element={<OperatorRequestsHistoryPage />} />
      </Route>
    </Routes>
  );
}
