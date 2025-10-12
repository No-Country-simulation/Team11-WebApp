import { useState } from "react";
import { Menu, X, CircleUser, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import Login from '../../../features/auth/components/LoginForm.jsx'
import Register from '../../../features/auth/components/RegisterForm.jsx'

const Navbar = ({ variant = "home", user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setIsMenuOpen(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setIsMenuOpen(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      <div className="fixed w-full top-0 z-50">
        <nav className="bg-white shadow-md">
          <div className="h-9 bg-primary" />
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6 lg:space-x-10">
                <div className="flex-1 items-center">
                  <img
                    src="/logo.svg"
                    alt="PYFIN"
                    className="h-18 w-auto -mt-9"
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
                  <button 
                    onClick={handleOpenLogin}
                    className="px-4 py-2 text-text font-medium cursor-pointer inline-flex items-center gap-2"
                  >
                    <CircleUser className="h-5 w-5 text-Violet" />
                    Ingresar
                  </button>
                  <button 
                    onClick={handleOpenRegister}
                    className="px-6 py-2 bg-Violet text-white font-semibold rounded-full shadow-sm cursor-pointer"
                  >
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
                    <button 
                      onClick={handleOpenLogin}
                      className="w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <CircleUser className="h-5 w-5 text-Violet" />
                      Ingresar
                    </button>
                    <button 
                      onClick={handleOpenRegister}
                      className="block w-full max-w-md text-left px-3 py-2 bg-Violet text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                    >
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

      {/* Modal Login */}
      {showLogin && (
        <div 
          className="fixed inset-0 flex items-center justify-end z-50 p-4"
          onClick={handleCloseModals}
        >
          <div 
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Login />
          </div>
        </div>
      )}

      {/* Modal Register */}
      {showRegister && (
        <div 
          className="fixed inset-0 bg-alt-transparent flex items-center justify-center z-50 p-4"
          onClick={handleCloseModals}
        >
          <div 
            className="max-w-2xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Register />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;