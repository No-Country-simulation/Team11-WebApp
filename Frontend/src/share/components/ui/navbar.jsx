import { useState } from "react";
import {
  Menu,
  X,
  CircleUser,
  Bell,
  ChevronDown,
  UserCircle,
  LayoutDashboard,
  GaugeCircle,
  LogOut,
  Building,
  Building2,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../../features/auth/hooks/useAuthStore.js";
import Login from "../../../features/auth/components/LoginForm.jsx";
import Register from "../../../features/auth/components/RegisterForm.jsx";

const Navbar = ({ variant = "home" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, roles, clearAuth, isAuthenticated } = useAuthStore();

  // Detectar si estamos en rutas de operador
  const isOperatorRoute = location.pathname.startsWith('/operador');

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

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

  // LINKS
  const homeLinks = [
    { to: "/", label: "Inicio" },
    { to: "/nosotros", label: "Nosotros" },
    { to: "/financiamiento", label: "Financiamiento" },
  ];

  const operatorHomeLinks = [
    { to: "/operador", label: "Inicio", end: true},
    { to: "/operador/nosotros", label: "Nosotros" },
    { to: "/operador/financiamiento", label: "Financiamiento" },
  ];

  const pymeLinks = [
    { to: "/panel", label: "Inicio", end: true },
    { to: "/panel/mis-solicitudes", label: "Mis solicitudes" },
    { to: "/panel/documentacion", label: "Documentación" },
    { to: "/panel/historial-credito", label: "Historial de crédito" },
  ];

  const operatorLinks = [
    { to: "/operador/panel", label: "Inicio", end: true },
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

  // Determinar qué enlaces mostrar basado en la ruta actual
  const getLinks = () => {
    if (isOperatorRoute && !location.pathname.startsWith('/operador/panel')) {
      return operatorHomeLinks;
    }
    if (variant === "operator" || location.pathname.startsWith('/operador/panel')) {
      return operatorLinks;
    }
    if (variant === "pyme") {
      return pymeLinks;
    }
    return homeLinks;
  };

  const links = getLinks();

  return (
    <>
      <div className="fixed w-full top-0 z-50">
        <nav className="bg-white shadow-md">
          <div className="h-9 bg-primary" />
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* LOGO + LINKS */}
              <div className="flex items-center space-x-6 lg:space-x-10">
                <img
                  src="/logo.svg"
                  alt="PYFIN"
                  className="h-18 w-auto -mt-9"
                />
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
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

              {/* AUTENTICACIÓN / DROPDOWN */}
              {isAuthenticated() ? (
                <div className="relative hidden lg:flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-Violet cursor-pointer" />
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 font-semibold text-text hover:text-secondary"
                  >
                    <CircleUser className="h-5 w-5 text-Violet" />
                    {email || "Usuario"}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* DROPDOWN */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-8 w-48 bg-white z-50 text-primary">
                      <button
                        onClick={() => {
                          navigate("/perfil");
                          setDropdownOpen(false);
                        }}
                        className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <UserCircle /> Mi perfil
                      </button>

                      {/* SOLO EN HOME: enlaces a panel según rol */}
                      {variant === "home" && roles.includes("CLIENT") && (
                        <button
                          onClick={() => {
                            navigate("/panel");
                            setDropdownOpen(false);
                          }}
                          className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <LayoutDashboard /> Panel
                        </button>
                      )}
                      {variant === "home" &&
                        roles.some((r) =>
                          ["OPERATOR", "OPERADOR", "ADMIN"].includes(r)
                        ) && (
                          <button
                            onClick={() => {
                              navigate("/operador/panel");
                              setDropdownOpen(false);
                            }}
                            className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <GaugeCircle /> Operador
                          </button>
                        )}

                      {/* CUENTA EMPRESA para Pyme */}
                      {variant === "pyme" && (
                        <button
                          onClick={() => {
                            navigate("/panel/empresa");
                            setDropdownOpen(false);
                          }}
                          className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <Building2 /> Cuenta empresa
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <LogOut /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <button
                    onClick={handleOpenLogin}
                    className="px-4 py-2 text-text font-medium inline-flex items-center gap-2"
                  >
                    <CircleUser className="h-5 w-5 text-Violet" />
                    Ingresar
                  </button>
                  <button
                    onClick={handleOpenRegister}
                    className="px-6 py-2 bg-Violet text-white font-semibold rounded-full shadow-sm"
                  >
                    Crear cuenta
                  </button>
                </div>
              )}

              {/* MENÚ MÓVIL */}
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

          {/* MENÚ MÓVIL DESPLEGABLE */}
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
                        isActive
                          ? "text-secondary"
                          : "text-text hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                {isAuthenticated() ? (
                  
                  <div className="text-text">
                    <div class="h-px bg-gray-300 my-4"></div>
                    <button
                      onClick={() => {
                        navigate("/perfil");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 font-medium hover:bg-gray-50"
                    >
                      Mi perfil
                    </button>

                    {variant === "home" && roles.includes("CLIENT") && (
                      <button
                        onClick={() => {
                          navigate("/panel");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 font-medium hover:bg-gray-50"
                      >
                        Panel
                      </button>
                    )}
                    {variant === "home" &&
                      roles.some((r) => ["OPERATOR"].includes(r)) && (
                        <button
                          onClick={() => {
                            navigate("/operador/panel");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 font-medium hover:bg-gray-50"
                        >
                          Admin
                        </button>
                      )}

                    {variant === "pyme" && (
                      <button
                        onClick={() => {
                          navigate("/panel/cuenta");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 font-medium hover:bg-gray-50"
                      >
                        Cuenta empresa
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 font-medium hover:bg-gray-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleOpenLogin}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <CircleUser className="h-5 w-5 text-Violet" />
                      Ingresar
                    </button>
                    <button
                      onClick={handleOpenRegister}
                      className="block w-full text-left px-3 py-2 bg-Violet text-white font-medium rounded-full hover:opacity-90"
                    >
                      Crear cuenta
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* MODALES */}
      {showLogin && (
        <div
          className="fixed inset-0 flex items-center justify-end z-50 p-4"
          onClick={handleCloseModals}
        >
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <Login onClose={handleCloseModals} />
          </div>
        </div>
      )}

      {showRegister && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40"
          onClick={handleCloseModals}
        >
          <div
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Register onClose={handleCloseModals} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
