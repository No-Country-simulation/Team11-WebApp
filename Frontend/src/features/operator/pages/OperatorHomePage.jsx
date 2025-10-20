export default function OperatorHomePage() {
  return (
    <div className="w-full bg-primary">
      <div className="grid md:grid-cols-12 items-stretch max-w-7xl mx-auto py-8">
        {/* Sección principal izquierda - Tarjeta blanca */}
        <div className="md:col-span-8 bg-white shadow-lg m-4 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">
              Este es el resumen de tu actividad
            </h1>
            <p className="text-lg italic text-text">
              Gestión de solicitudes del mes
            </p>
          </div>

          {/* Grid de datos 2x2 */}
          <div className="grid grid-cols-2 gap-8">
            {/* Aprobadas */}
            <div className="flex items-start gap-4">
              <div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 border-2 border-green-700 flex items-center justify-center rounded-full">
                    <span className="text-g font-bold text-md p-2">i</span>
                  </div>
                  <p className="font-bold text-green-700 text-lg">Aprobadas</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full"></div>
                  <p className="text-gray-600">10 solicitudes</p>
                </div>
              </div>
            </div>

            {/* Rechazadas */}
            <div className="flex items-start gap-4">
              <div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 border-2 border-red-700 flex items-center justify-center rounded-full">
                    <span className="text-red-700 font-bold text-md p-2">i</span>
                  </div>
                  <p className="font-bold text-red-700 text-lg">Rechazadas</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full"></div>
                  <p className="text-gray-600">40 solicitudes</p>
                </div>
              </div>
            </div>

            {/* En revisión */}
            <div className="flex items-start gap-4">
              <div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 border-2 border-orange-700 flex items-center justify-center rounded-full">
                    <span className="text-orange-700 font-bold text-md p-2">i</span>
                  </div>
                  <p className="font-bold text-orange-700 text-lg">En revisión</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full"></div>
                  <p className="text-gray-600">50 solicitudes</p>
                </div>
              </div>
            </div>

            {/* Promedio montos */}
            <div className="flex items-start gap-4">
              <div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 border-2 border-purple-700 flex items-center justify-center rounded-full p-2">
                    <span className="text-purple-700 font-bold text-md p-2">i</span>
                  </div>
                  <p className="font-bold text-purple-700 text-lg">Promedio montos solicitado</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full"></div>
                  <p className="text-gray-600">$ 15.000.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar derecho */}
        <aside className="md:col-span-4 p-6 flex flex-col justify-center gap-6">
          <button className="bg-white text-text font-medium text-lg rounded-sm py-4 px-6 shadow-lg hover:shadow-xl transition-shadow">
            Solicitudes nuevas esta semana
          </button>

          <button className="bg-white text-text font-medium text-lg rounded-sm py-4 px-6 shadow-lg hover:shadow-xl transition-shadow">
            Documentación pendiente de revisión
          </button>

          <button className="bg-white text-text font-medium text-lg rounded-sm py-4 px-6 shadow-lg hover:shadow-xl transition-shadow">
            Monto total gestionado
          </button>

          <button className="bg-white text-text font-medium text-lg rounded-sm py-4 px-6 shadow-lg hover:shadow-xl transition-shadow">
            Acceder a métricas operativas
          </button>
        </aside>
      </div>
    </div>
  );
}
