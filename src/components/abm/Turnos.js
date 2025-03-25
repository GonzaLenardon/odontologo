import { useState } from 'react';

const Turnos = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [turnos, setTurnos] = useState(generateTurnos());
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState('');

  function generateTurnos() {
    let turnos = [];
    for (let hour = 9; hour < 19; hour++) {
      turnos.push({ hora: `${hour}:00 hs`, reservado: false, paciente: '' });
      turnos.push({ hora: `${hour}:30 hs`, reservado: false, paciente: '' });
    }
    turnos.push({ hora: '19:00 hs', reservado: false, paciente: '' });
    return turnos;
  }

  const handleTurnoClick = (index) => {
    setSelectedTurno(index);
    setNombrePaciente(turnos[index].paciente);
  };

  const handleGuardarTurno = () => {
    setTurnos((prevTurnos) => {
      const newTurnos = [...prevTurnos];
      newTurnos[selectedTurno] = {
        ...newTurnos[selectedTurno],
        reservado: true,
        paciente: nombrePaciente,
      };
      return newTurnos;
    });
    setSelectedTurno(null);
    setNombrePaciente('');
  };

  return (
    <div className="w-full mx-auto p-5 shadow-lg rounded-lg">
      <div className="bg-[#60A5FA] p-5 rounded-xl mb-5">
        <h2 className="text-xl font-bold mb-3 text-center text-gray-700">
          Agenda de Turnos
        </h2>

        {/* Input de fecha */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-1">
            Seleccionar Fecha:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Listado de turnos */}
      <div className=" p-3 rounded-lg  overflow-y-auto grid grid-cols-3 gap-3">
        {turnos.map((turno, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md shadow text-center cursor-pointer ${
              turno.reservado ? 'bg-blue-400 text-white' : 'bg-white'
            } text-black font-bold`}
            onClick={() => handleTurnoClick(index)}
          >
            {turno.hora} {turno.reservado ? `- ${turno.paciente}` : ''}
          </div>
        ))}
      </div>

      {/* Modal de reserva */}
      {selectedTurno !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-2">Reservar Turno</h3>
            <input
              type="text"
              placeholder="Nombre del paciente"
              value={nombrePaciente}
              onChange={(e) => setNombrePaciente(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTurno(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarTurno}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
