import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCreditApplicationsStore } from "../store/useCreditApplicationsStore";
import { useEffect } from "react";

export default function PymeRequestsLayout() {
  const tabs = [
    { to: "pendientes", label: "En Revisión", status: "PENDING" },
    { to: "aprobadas", label: "Aprobada", status: "APPROVED" },
    { to: "rechazadas", label: "Rechazada", status: "REJECTED" },
    { to: "guardadas", label: "Guardadas", status: "SAVE" },
  ];

  const navigate = useNavigate();
  const {
    loading,
    fetchApplications,
    setFilters,
  } = useCreditApplicationsStore();

  // Cargar aplicaciones al montar el componente
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Función para manejar el cambio de pestaña
  const handleTabChange = (status) => {
    setFilters({ status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/panel/crear-solicitud")}
          className="px-4 sm:px-6 py-1 sm:py-2 bg-secondary text-white font-extrabold text-xl rounded-4xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
        >
          Solicita tu crédito ahora
        </button>
      </div>

      <nav className="mt-6 flex flex-wrap gap-8 text-text">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex font-bold text-xl transition-colors duration-300 ${
                isActive
                  ? "underline underline-offset-4 text-secondary"
                  : "hover:text-secondary text-text"
              }`
            }
            onClick={() => handleTabChange(tab.status)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}