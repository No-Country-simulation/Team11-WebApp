import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../../features/home/pages/HomePage";
import AboutUsPage from "../../features/home/pages/AboutUsPage";
import FinancingPage from "../../features/home/pages/FinancingPage";
import OperatorLayout from "../layouts/OperatorLayout";
import OperatorHomePage from "../../features/operator/pages/OperatorHomePage";
import OperatorReportsPage from "../../features/operator/pages/OperatorReportsPage";
import OperatorRequestsHistoryPage from "../../features/operator/pages/OperatorRequestsHistoryPage";
import OperatorRequestsLayout from "../../features/operator/layouts/OperatorRequestsLayout";
import OperatorRequestsInReviewPage from "../../features/operator/pages/requests/OperatorRequestsInReviewPage";
import OperatorRequestsApprovedPage from "../../features/operator/pages/requests/OperatorRequestsApprovedPage";
import OperatorRequestsRejectedPage from "../../features/operator/pages/requests/OperatorRequestsRejectedPage";
import OperatorRequestsSavedPage from "../../features/operator/pages/requests/OperatorRequestsSavedPage";
import PymeLayout from "../layouts/PymeLayout";
import PymeHomePage from "../../features/pyme/pages/PymeHomePage";
import PymeDocumentationPage from "../../features/pyme/pages/PymeDocumentationPage";
import PymeCreditHistoryPage from "../../features/pyme/pages/PymeCreditHistoryPage";
import OperatorRequestsManagePage from "../../features/operator/pages/OperatorRequestsManagePage";
import { ProtectedRoute } from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas públicas --- */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<AboutUsPage />} />
        <Route path="/financiamiento" element={<FinancingPage />} />        
      </Route>
      
      <Route element={<HomeLayout />}>
        <Route path="/operador" element={<HomePage />} />
        <Route path="/operador/nosotros" element={<AboutUsPage />} />
        <Route path="/operador/financiamiento" element={<FinancingPage />} />        
      </Route>
            
      {/* --- Panel PYME (solo CLIENT) --- */}
      <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
        <Route path="/panel" element={<PymeLayout />}>
          <Route index element={<PymeHomePage />} />
          <Route path="mis-solicitudes" element={<OperatorRequestsLayout />}>
            <Route index element={<Navigate to="pendientes" replace />} />
            <Route
              path="pendientes"
              element={<OperatorRequestsInReviewPage />}
            />
            <Route
              path="aprobadas"
              element={<OperatorRequestsApprovedPage />}
            />
            <Route
              path="rechazadas"
              element={<OperatorRequestsRejectedPage />}
            />
            <Route path="guardadas" element={<OperatorRequestsSavedPage />} />
          </Route>
          <Route path="documentacion" element={<PymeDocumentationPage />} />
          <Route path="historial-credito" element={<PymeCreditHistoryPage />} />
        </Route>
      </Route>

      {/* --- Panel OPERADOR (OPERATOR) --- */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["OPERATOR"]} />
        }
      >
        <Route path="/operador/panel" element={<OperatorLayout />}>
          <Route index element={<OperatorHomePage />} />
          <Route
            path="gestion-solicitudes"
            element={<OperatorRequestsManagePage />}
          />
          <Route path="reportes" element={<OperatorReportsPage />} />
          <Route
            path="historial-solicitudes"
            element={<OperatorRequestsHistoryPage />}
          />
        </Route>
      </Route>

      {/* --- Si no hay match, redirigir al inicio --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
