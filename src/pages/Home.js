import React, { useState } from 'react';
import Tareas from '../components/abm/Tareas';
import Preguntas from '../components/abm/Preguntas';
import RespuestasRol from '../components/abm/RespuestasRol';
import Zonas from '../components/abm/Zonas';
import LocacionesEquipos from '../components/abm/LocacionesEquipos';
import Puestos from '../components/abm/Puestos';
import { ModalTarea } from '../components/dialogs/ModalTarea';
import Ayuda from '../components/abm/Ayuda';
import Usuarios from '../components/abm/Usuarios';
import HomeNew from './HomeNew';
import Turnos from '../components/abm/Turnos';
import Odontologos from '../components/abm/Odontologos';
import OSociales from '../components/abm/OSociales';
import Proveedores from '../components/abm/Proveedores';

export default function Home() {
  const [currentAbm, setCurrentAbm] = useState('tareas');
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para manejar el colapso

  // Dividir los selectores en básicos y avanzados
  const basicSelectores = [
    { title: 'Paciente', abm: 'tareas', component: <HomeNew /> },
    { title: 'Turnos', abm: 'puestosRoles', component: <Turnos /> },
    { title: 'Obras Sociales', abm: 'zonas', component: <OSociales /> },
  ];

  const advancedSelectores = [
    { title: 'Odontologos', abm: 'preguntas', component: <Odontologos /> },
    {
      title: 'Proveedores',
      abm: 'respuestas',
      component: <Proveedores />,
    },
    /*  { title: 'Equipos', abm: 'locEquipos', component: <LocacionesEquipos /> }, */
  ];

  return (
    <div className="home flex flex-row gap-5 alturafull w-[100vw]">
      {/* Menú lateral con estado de colapso */}
      <div
        className={`ccontainer relative flex flex-col gap-2 my-5 ml-5 ${
          isCollapsed ? 'w-0 overflow-hidden' : 'w-[300px]'
        }`}
        style={{ transition: 'width 0.3s ease' }} // Animación para un colapso suave
      >
        {/* Botón colapsable */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 absolute bg-blue-500 text-white font-bold text-2xl 
            w-[40px] h-[40px]`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            borderRadius: '20%',
            border: '0px solid white',
            alignSelf: isCollapsed ? 'center' : 'flex-end',
            backgroundColor: isCollapsed ? 'gray' : 'rgb(185, 197, 211)', // Color dinámico
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.192)',
            top: '0px',
            right: !isCollapsed ? '0px' : 'auto',
          }}
        >
          {isCollapsed ? '>' : '<'}
        </button>

        {/* Botón para alternar el estado de colapso */}
        {!isCollapsed && (
          <>
            <div className="mt-6" />
            {/* Lista de selectores básicos */}
            <label className="text-white text-xl">
              {' '}
              Hola, {''} {localStorage.getItem('paciente')}
            </label>

            {basicSelectores.map((data, index) => (
              <div
                key={index}
                className="citem"
                style={
                  currentAbm === data.abm
                    ? { backgroundColor: 'rgb(153, 184, 219)' }
                    : undefined
                }
                onClick={() => setCurrentAbm(data.abm)}
              >
                <div className="flex m-auto">{data.title}</div>
              </div>
            ))}
            {/* Texto separador */}
            <div className="separator text-gray-500 text-sm my-3">
              Opciones avanzadas
            </div>
            {/* Lista de selectores avanzados */}
            {advancedSelectores.map((data, index) => (
              <div
                key={`advanced-${index}`}
                className="citem"
                style={
                  currentAbm === data.abm
                    ? { backgroundColor: 'rgb(184, 219, 153)' } // Color diferente para distinguir
                    : undefined
                }
                onClick={() => setCurrentAbm(data.abm)}
              >
                <div className="flex m-auto">{data.title}</div>
              </div>
            ))}
          </>
        )}

        {/* parte inferior */}
      </div>

      {/* Contenedor principal */}
      <div
        className={`ccontainer h-[100%] my-5 mr-5 ${
          isCollapsed ? 'w-[100%]' : 'w-[calc(100%-305px)]'
        }`}
        style={{ transition: 'width 0.3s ease' }}
      >
        {
          basicSelectores
            .concat(advancedSelectores)

            .find((selector) => selector.abm === currentAbm)?.component
        }
      </div>
    </div>
  );
}
