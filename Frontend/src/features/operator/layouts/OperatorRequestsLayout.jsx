import { NavLink, Outlet } from "react-router-dom";

export default function OperatorRequestsLayout() {
  const tabs = [
    { to: "pendientes", label: "En Revisión" },
    { to: "aprobadas", label: "Aprobada" },
    { to: "rechazadas", label: "Rechazada" },
    { to: "guardadas", label: "Guardadas" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <button className="px-4 sm:px-6 py-1 sm:py-2 bg-secondary text-white font-extrabold text-xl rounded-4xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer">
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
