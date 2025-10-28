import { useCreditApplicationsStore } from "../../store/useCreditApplicationsStore";
import { useNavigate } from "react-router-dom";

export default function PymeRequestsSavedPage() {
  const { getApplicationsByStatus, loading, error } =
    useCreditApplicationsStore();

  const navigate = useNavigate();

  // Obtener solo las aplicaciones guardadas (borradores)
  const applications = getApplicationsByStatus("SAVE");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const handleCompleteAndSend = (applicationId) => {
    navigate(`/panel/crear-solicitud?edit=${applicationId}`);
  };

  const handleViewDetails = (applicationId) => {
    navigate(`/panel/solicitudes/borrador/${applicationId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error al cargar las solicitudes: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-text">
      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay solicitudes guardadas</p>
          <button 
            onClick={() => navigate("/panel/crear-solicitud")}
            className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
          >
            Crear nueva solicitud
          </button>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-bold">N° Solicitud</th>
              <th className="px-4 py-3 text-left font-bold">Fecha de guardado</th>
              <th className="px-4 py-3 text-left font-bold">Estado</th>
              <th className="px-4 py-3 text-left font-bold">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  #{application.id.slice(-6)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(application.createdAt || application.updatedAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-orange-600 font-medium">
                  Guardada sin enviar
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleCompleteAndSend(application.id)}
                      className="text-primary underline text-sm hover:text-primary-dark"
                    >
                      Completar y enviar
                    </button>
                    <button 
                      onClick={() => handleViewDetails(application.id)}
                      className="text-gray-600 underline text-sm hover:text-gray-800"
                    >
                      Ver detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}