import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 bg-primary-darker text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
        {/* Columna principal */}
        <div>
          <h3 className="text-4xl font-bold">PYFIN</h3>
          <p className="mt-4 text-white font-semibold">Pymes financiadas.</p>
          <p className="text-white font-semibold">
            Soluciones financieras ágiles y seguras para pymes
          </p>
          <div className="mt-6 space-y-3 font-semibold">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <span>contacto@pyfin.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <span>finanzas@pyfin.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5" />
              <span>+54 9 11 3333-4444</span>
            </div>
          </div>
        </div>

        {/* Columna Empresas */}
        <div>
          <h4 className="text-3xl font-bold">Empresas</h4>
          <ul className="mt-4 space-y-3 text-white font-semibold">
            <li>Solicitar crédito</li>
            <li>Cargar documentos</li>
            <li>Seguimiento de mi solicitud</li>
          </ul>
        </div>

        {/* Columna Recursos */}
        <div>
          <h4 className="text-3xl font-bold">Recursos</h4>
          <ul className="mt-4 space-y-3 text-white font-semibold">
            <li>Preguntas Frecuentes</li>
            <li>Soporte técnico</li>
          </ul>
        </div>

        {/* Columna Legal */}
        <div>
          <h4 className="text-3xl font-bold">Legal</h4>
          <ul className="mt-4 space-y-3 text-white font-semibold">
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
            <li>Seguridad de datos</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        <hr className="border-white" />
        <p className="text-center mt-6 text-white font-semibold">
          © 2025 PYFIN. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
