import { useState } from "react";
import { Menu, X, CircleUser, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = ({ variant = "home", user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const homeLinks = [
    { to: "/", label: "Inicio" },
    { to: "/nosotros", label: "Nosotros" },
    { to: "/financiamiento", label: "Financiamiento" },
  ];

  const pymeLinks = [
    { to: "/panel", label: "Inicio" },
    { to: "/panel/mis-solicitudes", label: "Mis solicitudes" },
    { to: "/panel/documentacion", label: "Documentación" },
    { to: "/panel/historial-credito", label: "Historial de crédito" },
  ];

  const operatorLinks = [
    { to: "/operador/panel", label: "Inicio" },
    {
      to: "/operador/panel/gestion-solicitudes",
      label: "Gestión de solicitudes",
    },
    { to: "/operador/panel/reportes", label: "Reportes / Analytics" },
    {
      to: "/operador/panel/historial-solicitudes",
      label: "Historial de solicitudes",
    },
  ];

  const links =
    variant === "operator"
      ? operatorLinks
      : variant === "pyme"
      ? pymeLinks
      : homeLinks;

  return (
    <div className="fixed w-full top-0 z-50">
      <nav className="bg-white shadow-md">
        <div className="h-9 bg-primary" />
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6 lg:space-x-10">
              <div className="flex-1 items-center">
                <img
                  src="/logo.png"
                  alt="PYFIN"
                  className="h-22 w-auto -mt-9"
                />
              </div>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `hidden lg:block font-bold text-xl transition-colors duration-300 ${
                      isActive
                        ? "underline underline-offset-4 text-secondary"
                        : "hover:text-secondary text-text"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {variant === "home" ? (
              <div className="hidden lg:flex items-center space-x-4">
                <button className="px-4 py-2 text-text font-medium cursor-pointer inline-flex items-center gap-2">
                  <CircleUser className="h-5 w-5 text-Violet" />
                  Ingresar
                </button>
                <button className="px-6 py-2 bg-Violet text-white font-semibold rounded-full shadow-sm cursor-pointer">
                  Crear cuenta
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-6">
                <Bell className="h-5 w-5 text-Violet" />
                <CircleUser className="h-5 w-5 text-Violet" />
                {variant === "operator" && (
                  <span className="font-bold text-xl text-text">
                    {`Hola ${user?.name ?? "Usuario"}!`}
                  </span>
                )}
                {variant === "pyme" && (
                  <span className="font-bold text-xl text-text">
                    {user?.companyName ?? "Nombrepyme"}
                  </span>
                )}
              </div>
            )}

            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  end
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 font-medium transition-colors ${
                      isActive ? "text-secondary" : "text-text hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {variant === "home" ? (
                <>
                  <button className="w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <CircleUser className="h-5 w-5 text-Violet" />
                    Ingresar
                  </button>
                  <button className="block w-full max-w-md text-left px-3 py-2 bg-Violet text-white font-medium rounded-full hover:opacity-90 transition-opacity">
                    Crear cuenta
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4 px-3 py-2">
                  <Bell className="h-5 w-5 text-Violet" />
                  <CircleUser className="h-5 w-5 text-Violet" />
                  {variant === "operator" ? (
                    <span className="font-semibold text-text">{`Hola ${
                      user?.name ?? "Usuario"
                    }!`}</span>
                  ) : (
                    <span className="font-semibold text-text">
                      {user?.companyName ?? "Nombrepyme"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
