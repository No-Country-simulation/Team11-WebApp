import { useState } from "react";
import { Menu, X, UserRound, User2, CircleUser } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hidden lg:block font-bold text-xl transition-colors duration-300 ${
                    isActive
                      ? "underline underline-offset-4 text-secondary"
                      : "hover:text-secondary text-text"
                  }`
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/nosotros"
                className={({ isActive }) =>
                  `hidden lg:block font-bold text-xl transition-colors duration-300 ${
                    isActive
                      ? "underline underline-offset-4 text-secondary"
                      : "hover:text-secondary text-text"
                  }`
                }
              >
                Nosotros
              </NavLink>
              <NavLink
                to="/financiamiento"
                className={({ isActive }) =>
                  `hidden lg:block font-bold text-xl transition-colors duration-300 ${
                    isActive
                      ? "underline underline-offset-4 text-secondary"
                      : "hover:text-secondary text-text"
                  }`
                }
              >
                Financiamiento
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <button className="px-4 py-2 text-text font-medium cursor-pointer inline-flex items-center gap-2">
                <CircleUser className="h-5 w-5 text-Violet" />
                Ingresar
              </button>
              <button className="px-6 py-2 bg-Violet text-white font-semibold rounded-full shadow-sm cursor-pointer">
                Crear cuenta
              </button>
            </div>

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
              <button className="block w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors">
                Inicio
              </button>
              <button className="block w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors">
                Nosotros
              </button>
              <button className="block w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors">
                Financiamiento
              </button>
              <button className="w-full text-left px-3 py-2 text-text font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <CircleUser className="h-5 w-5 text-Violet" />
                Ingresar
              </button>
              <button className="block w-full max-w-md text-left px-3 py-2 bg-Violet text-white font-medium rounded-full hover:opacity-90 transition-opacity">
                Crear cuenta
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
