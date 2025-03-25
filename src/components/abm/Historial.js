import { useState } from 'react';

const Historial = ({ historial }) => {
  const [busqueda, setBusqueda] = useState('');

  console.log('first', historial);
  /*  const registros = [
    {
      fecha: '2025-03-20',
      hora: '10:00 AM',
      codigo: 'A001',
      diente: 'Molar 18',
      cara: 'Oclusal',
      observacion: 'Caries incipiente',
      nombre: 'Juan Rodriguez',
    },
    {
      fecha: '2025-03-20',
      hora: '10:30 AM',
      codigo: 'A002',
      diente: 'Premolar 24',
      cara: 'Mesial',
      observacion: 'Restauración necesaria',
      nombre: 'Juan Rodriguez',
    },
    {
      fecha: '2025-03-20',
      hora: '11:00 AM',
      codigo: 'A003',
      diente: 'Incisivo 11',
      cara: 'Distal',
      observacion: 'Desgaste leve',
      nombre: 'Juan Rodriguez',
    },
    {
      fecha: '2025-03-20',
      hora: '11:30 AM',
      codigo: 'A004',
      diente: 'Canino 33',
      cara: 'Lingual',
      observacion: 'Fractura pequeña',
      nombre: 'Juan Rodriguez',
    },
    {
      fecha: '2025-03-20',
      hora: '12:00 PM',
      codigo: 'A005',
      diente: 'Molar 46',
      cara: 'Vestibular',
      observacion: 'Placa bacteriana',
      nombre: 'Romina Cabral',
    },
    {
      fecha: '2025-03-20',
      hora: '12:30 PM',
      codigo: 'A006',
      diente: 'Premolar 14',
      cara: 'Palatino',
      observacion: 'Restauración en buen estado',
      nombre: 'Romina Cabral',
    },
    {
      fecha: '2025-03-20',
      hora: '01:00 PM',
      codigo: 'A007',
      diente: 'Molar 37',
      cara: 'Oclusal',
      observacion: 'Sellante aplicado',
      nombre: 'Romina Cabral',
    },
    {
      fecha: '2025-03-20',
      hora: '01:30 PM',
      codigo: 'A008',
      diente: 'Incisivo 21',
      cara: 'Distal',
      observacion: 'Desgaste leve',
      nombre: 'Martin Lopez',
    },
    {
      fecha: '2025-03-20',
      hora: '02:00 PM',
      codigo: 'A009',
      diente: 'Canino 43',
      cara: 'Mesial',
      observacion: 'Ligera pigmentación',
      nombre: 'Martin Lopez',
    },
    {
      fecha: '2025-03-20',
      hora: '02:30 PM',
      codigo: 'A010',
      diente: 'Molar 28',
      cara: 'Vestibular',
      observacion: 'Extracción recomendada',
      nombre: 'Martin Lopez',
    },
  ]; */

  // Filtrar registros según la búsqueda
  /*  const registrosFiltrados = registros.filter((registro) =>
    Object.values(registro).some((valor) =>
      valor.toLowerCase().includes(busqueda.toLowerCase())
    ) 
  ); */

  return (
    <div className="max-w-5xl h-[65vh] mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Título fijo */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Historial Odontológico
      </h2>

      {/* Contenedor con scroll interno */}
      <div className="relative border rounded-lg overflow-hidden">
        {/* Cabecera fija */}
        <div className="sticky top-0 bg-blue-500 text-white shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 border border-gray-300 w-[15%]">Fecha</th>
                <th className="p-3 border border-gray-300 w-[20%]">Paciente</th>
                <th className="p-3 border border-gray-300 w-[15%]">Código</th>
                <th className="p-3 border border-gray-300 w-[15%]">Diente</th>
                <th className="p-3 border border-gray-300 w-[15%]">Cara</th>
                <th className="p-3 border border-gray-300 w-[20%]">
                  Observación
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Datos con scroll interno */}
        <div className="max-h-100 overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {historial.length > 0 ? (
                historial.map((registro, index) => (
                  <tr
                    key={index}
                    className="text-center odd:bg-gray-100 even:bg-gray-200"
                  >
                    <td className="p-3 border border-gray-300 w-[15%]">
                      {registro.fecha}
                    </td>
                    <td className="p-3 border border-gray-300 w-[20%]">
                      {registro.nombre}
                    </td>
                    <td className="p-3 border border-gray-300 w-[15%]">
                      {registro.codigo}
                    </td>
                    <td className="p-3 border border-gray-300 w-[15%]">
                      {registro.diente}
                    </td>
                    <td className="p-3 border border-gray-300 w-[15%]">
                      {registro.cara}
                    </td>
                    <td className="p-3 border border-gray-300 w-[20%]">
                      {registro.observacion}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    NO HAY REGISTROS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Historial;
