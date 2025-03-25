import { React, useEffect, useState } from 'react';
import { getTareas } from '../../api/tareas/getTareas';
import { useUserContext } from '../../context/UserContext';

import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import { Tabla } from '../abm/Tabla';
import { getAdminGrid } from '../../api/respuestas/getAdminGrid';
import Loader from '../elements/Loader';

export const ModalTarea = () => {
  const { logout } = useUserContext();
  const [selectedTarea, setSelectedTarea] = useState('');
  const [tareas, setTareas] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [modo, setModo] = useState('Lectura');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const resp = await getTareas(logout);
        setTareas(resp);
        console.log('Resultado de getTareas:', resp);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };

    fetchTareas();
  }, [logout]);

  useEffect(() => {
    selectedTarea && fetchData();
    setModo('Lectura');
  }, [selectedTarea]);

  const fetchData = async () => {
    setLoader(true);
    try {
      const grid = await getAdminGrid(logout, selectedTarea);
      const result = await formatData(grid);
      setRespuestas(result.formattedData);
      setColumnas(result.largestEntry);

      console.log('jejejeje ', result);
      return grid;
    } catch (error) {
      console.error('Error al obtener preguntas y respuestas', error);
    } finally {
      setLoader(false);
    }
  };

  const formatData = async (data) => {
    let largestEntry = null; // Variable para almacenar el objeto con la mayor longitud de respuestas
    let uniqueRoles = {};
    const formattedData = data.reduce((acc, item) => {
      // Busca si la pregunta ya existe en el resultado
      let questionEntry = acc.find((q) => q.idPregunta === item.id_pregunta);

      if (!questionEntry) {
        // Si no existe, crea un nuevo objeto de pregunta
        questionEntry = {
          idPregunta: item.id_pregunta,
          pregunta: item.pregunta,
          columna: item.columna_pregunta,
          respuestas: [],
        };
        acc.push(questionEntry);
      }

      // Agrega la respuesta con el id del rol
      questionEntry.respuestas.push({
        idRol: item.id_rol,
        id_respuesta: item.id_respuesta,
        nombreRol: item.nombre_rol,
        respuesta: item.respuesta_rol,
      });

      // Ordena las respuestas por idRol en orden ascendente
      /*    questionEntry.respuestas.sort((a, b) => a.idRol - b.idRol); */

      // Verifica si la longitud de respuestas de este questionEntry es la mayor hasta ahora
      /*  if (
        !largestEntry ||
        questionEntry.respuestas.length > largestEntry.respuestas.length
      ) {
        largestEntry = questionEntry;
      } */

      if (item.id_rol !== null && !uniqueRoles[item.id_rol]) {
        uniqueRoles[item.id_rol] = {
          idRol: item.id_rol,
          nombreRol: item.nombre_rol,
        };
      }

      return acc;
    }, []);

    largestEntry = Object.values(uniqueRoles);
    // Devuelve el objeto con todas las preguntas formateadas y el objeto con la lista de respuestas más larga
    return {
      formattedData,
      largestEntry,
    };
  };

  return (
    <div className="ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[100%] h-full overflow-auto">
      <FormControl fullWidth size="small">
        <Box display="flex" gap={2}>
          {' '}
          {/* Contenedor flex con espacio entre los elementos */}
          <FormControl fullWidth size="small" sx={{ flex: 0.8 }}>
            <InputLabel id="select-label">Tarea</InputLabel>
            <Select
              labelId="select-label"
              label="Tarea"
              value={selectedTarea}
              onChange={(e) => setSelectedTarea(e.target.value)}
            >
              {tareas.length > 0 &&
                tareas.map((data, index) => (
                  <MenuItem key={index} value={data.id_tarea}>
                    {data.nombre_tarea}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ flex: 0.2 }}>
            <InputLabel id="select-label">Modo Edicion</InputLabel>
            <Select
              labelId="select-modoEdicion"
              label="ModoEdicion"
              value={modo}
              onChange={(e) => setModo(e.target.value)}
            >
              <MenuItem key={1} value="Lectura">
                Lectura
              </MenuItem>
              <MenuItem key={2} value="Edicion">
                Edicion
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </FormControl>
      <div className="pt-5 h-full flex-2 overflow-auto  ">
        {selectedTarea && (
          <Tabla
            respuestas={respuestas}
            columnas={columnas}
            fetchData={fetchData}
            modo={modo}
            id_tarea={selectedTarea}
          />
        )}
      </div>
      <Loader open={loader} text={'Actualizando datos'} />
    </div>
  );
};
