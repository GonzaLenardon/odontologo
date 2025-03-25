import { React, useState } from 'react';
import Turnos from '../components/abm/Turnos';
import Historial from '../components/abm/Historial';
import Pacientes from '../components/abm/Pacientes';
import Documentacion from '../components/abm/Documentacion';
import Estudios from '../components/abm/Estudios';
import face from '../assets/face.avif';
import face1 from '../assets/face1.jpeg';
import face2 from '../assets/face2.webp';
import face4 from '../assets/face4.avif';
import face5 from '../assets/face5.avif';
import { yellow } from '@mui/material/colors';

const HomeNew = () => {
  const [currentAbm, setCurrentAbm] = useState('tareas');
  const [busqueda, setBusqueda] = useState('');

  const pacientes = [
    {
      nombres: 'Juan Rodriguez',
      dni: '41456698',
      domicilio: 'San Martín 444',
      localidad: 'Paraná',
      obraSocial: 'OMINT',
      nroAfiliado: '123456789',
      observaciones: 'Ninguna observación',
      face: face,
      odontologo: 'Macelo Maidana',
      turno: '17/05/2025',
    },
    {
      nombres: 'Maria Lopez',
      dni: '38547236',
      domicilio: 'Av. Corrientes 1234',
      localidad: 'Buenos Aires',
      obraSocial: 'Swiss Medical',
      nroAfiliado: '987654321',
      observaciones: 'Paciente con alergia a la anestesia',
      face: face1,
      odontologo: 'Cristina Martinez',
      turno: '12/04/2025',
    },
    {
      nombres: 'Carlos Pérez',
      dni: '40256321',
      domicilio: 'Belgrano 567',
      localidad: 'Rosario',
      obraSocial: 'Galeno',
      nroAfiliado: '456123789',
      observaciones: 'Requiere control trimestral',
      face: face4,
      odontologo: 'Macelo Maidana',
      turno: '11/04/2025',
    },
    {
      nombres: 'Ana Fernández',
      dni: '37485692',
      domicilio: 'Mitre 321',
      localidad: 'Córdoba',
      obraSocial: 'Medife',
      nroAfiliado: '741852963',
      observaciones: 'Uso de ortodoncia',
      face: face2,
      odontologo: 'Cristina Martinez ',
      turno: '04/04/2025',
    },
    {
      nombres: 'Pedro Gómez',
      dni: '42856329',
      domicilio: 'Sarmiento 890',
      localidad: 'Mendoza',
      obraSocial: 'OSDE',
      nroAfiliado: '159753468',
      observaciones: 'Consulta por implantes',
      face: face5,
      odontologo: 'Macelo Maidana',
      turno: '12/05/2025',
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
    {
      title: 'Historial',
      abm: 'zonas',
      component: <Historial historial={historialFiltrados} />,
    },

    {
      title: 'Ficha Clinica',
      abm: 'grilla',
      component: <Documentacion />,
    },
    {
      title: 'Estudios',
      abm: 'Estudios',
      component: <Estudios />,
    },
  ];

  return (
    <div className="home flex flex-col gap-1  rounded w-[100%] h-[100%] mx-auto">
      <div className=" flex flex-col bg-blue-400 rounded-2xl mt-2">
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
                  {registrosFiltrados[0].obraSocial}
                </label>
                <label className="text-white text-lg">
                  Nro. {registrosFiltrados[0].nroAfiliado}
                </label>
              </div>
              <div className="flex flex-col w-[20%] items-start justify-center text-white">
                <label
                  style={{
                    color: 'yellow',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                  }}
                >
                  Turno
                </label>

                <label>{registrosFiltrados[0].turno} </label>
              </div>
              <div className="flex flex-col w-[20%] items-start justify-center text-white">
                <label
                  style={{
                    color: 'yellow',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                  }}
                >
                  Tratamiento
                </label>

                <label>Ortodoncias </label>
              </div>
              <div className="flex flex-col w-[20%] items-start justify-center text-white">
                <label
                  style={{
                    color: 'yellow',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                  }}
                >
                  Odontologo
                </label>

                <label>{registrosFiltrados[0].odontologo} </label>
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
        className=" overflow-hidden opacity-80 h-auto mb-2 "
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

export default HomeNew;
