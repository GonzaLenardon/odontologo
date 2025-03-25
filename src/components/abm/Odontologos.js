import { React, useState } from 'react';
import Pacientes from './Pacientes';
import odontologo1 from '../../assets/odontologo1.jpeg';
import odontologo2 from '../../assets/odontologo2.jpeg';
const Odontologo = () => {
  const [currentAbm, setCurrentAbm] = useState('tareas');
  const [busqueda, setBusqueda] = useState('');

  const pacientes = [
    {
      nombres: 'Juan Rodriguez',
      dni: '41456698',
      domicilio: 'San Martín 444',
      localidad: 'Paraná',

      matricula: '123456789',

      face: odontologo1,
    },
    {
      nombres: 'Maria Lopez',
      dni: '38547236',
      domicilio: 'Av. Corrientes 1234',
      localidad: 'Buenos Aires',

      matricula: '987654321',

      face: odontologo2,
    },
  ];

  const dientes = [
    'Molar 18',
    'Premolar 24',
    'Incisivo 11',
    'Canino 33',
    'Molar 46',
  ];
  const caras = ['Oclusal', 'Mesial', 'Distal', 'Lingual', 'Vestibular'];
  const observaciones = [
    'Caries incipiente',
    'Restauración necesaria',
    'Desgaste leve',
    'Fractura pequeña',
    'Placa bacteriana',
  ];

  let registros = [];
  let codigo = 1;
  let fechaBase = new Date('2025-03-20T10:00:00');

  pacientes.forEach((paciente) => {
    for (let i = 0; i < 6; i++) {
      registros.push({
        fecha: fechaBase.toISOString().split('T')[0],
        hora: new Date(fechaBase.getTime() + i * 30 * 60000)
          .toISOString()
          .split('T')[1]
          .substring(0, 5),
        codigo: `A${String(codigo).padStart(3, '0')}`,
        diente: dientes[Math.floor(Math.random() * dientes.length)],
        cara: caras[Math.floor(Math.random() * caras.length)],
        observacion:
          observaciones[Math.floor(Math.random() * observaciones.length)],
        nombre: paciente.nombres,
      });
      codigo++;
    }
  });

  const registrosFiltrados = pacientes.filter((registro) =>
    registro.nombres.toLowerCase().includes(busqueda.toLowerCase())
  );
  console.log('registros pacientes.. ', registrosFiltrados);

  const historialFiltrados =
    registrosFiltrados.length > 0
      ? registros.filter(
          (registro) => registro.nombre === registrosFiltrados[0].nombres
        )
      : [];

  console.log('historial Filtrados ', historialFiltrados);

  const basicSelectores = [
    {
      title: 'Datos Personales',
      abm: 'tareas',
      component: <Pacientes paciente={registrosFiltrados[0]} />,
    },
  ];

  return (
    <div className="home flex flex-col gap-1  rounded w-[100%] h-[100%] mx-auto">
      <div className=" flex flex-col bg-green-600 rounded-2xl mt-2">
        <div className="justify-center mt-5">
          <select
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-[40%] h-[40px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Seleccionar paciente...</option>
            {registrosFiltrados.map((paciente, index) => (
              <option key={index} value={paciente.nombres}>
                {paciente.nombres}
              </option>
            ))}
          </select>
        </div>

        <div className="flex m-3">
          <img
            alt="imagenFace"
            src={registrosFiltrados[0].face}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />

          {registrosFiltrados.length === 1 && (
            <>
              <div className="flex flex-col w-[40%] items-start pl-3">
                <label className="text-white text-2xl font-extrabold">
                  {registrosFiltrados[0].nombres}
                </label>

                <label className="text-white text-lg">
                  Matricula. {registrosFiltrados[0].matricula}
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <ul className="flex flex-row gap-5 justify-around bg-white rounded-md">
        {basicSelectores.map((selector) => {
          return (
            <li
              className=" w-[15%] rounded-2xl p-2 cursor-pointer"
              onClick={() => setCurrentAbm(selector.abm)}
            >
              {selector.title}
            </li>
          );
        })}
      </ul>

      <div
        className=" overflow-hidden  opacity-80 h-[100%] mb-2"
        style={{ transition: 'width 0.3s ease' }}
      >
        {
          basicSelectores
            /*  .concat(advancedSelectores)
            .concat(parteInferior) // Unir ambos arrays para buscar el componente actual */
            .find((selector) => selector.abm === currentAbm)?.component
        }
      </div>
    </div>
  );
};

export default Odontologo;
