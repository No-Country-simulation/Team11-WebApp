export default function PymeRequestsSavedPage() {
  return (
    <div className="overflow-x-auto text-text">
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
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">#005</td>
            <td className="px-4 py-3 whitespace-nowrap">28/08/2025</td>
            <td className="px-4 py-3 whitespace-nowrap">Guardada sin enviar</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button className="text-primary underline text-sm">Completar y enviar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


