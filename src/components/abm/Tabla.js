import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Popover,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { padding, positions, styled, textAlign } from '@mui/system';
import { updateRespuesta } from '../../api/respuestas/updateRespuesta';
import { UserContext } from '../../context/UserContext';
import { deleteRespuesta } from '../../api/respuestas/deleteRespuesta';
import CSnackbar from '../elements/CSnackbar';
import Loader from '../elements/Loader';
import { updatePregunta } from '../../api/preguntas/updatePregunta';
import { postRespuesta } from '../../api/respuestas/postRespuesta';
import { postPregunta } from '../../api/preguntas/postPregunta';
import { deletePregunta } from '../../api/preguntas/deletePregunta';
import { getPuestos } from '../../api/puestos/getPuestos';
import { deleteRol } from '../../api/respuestas/deleteRol';

const StyledTableCell = styled(TableCell)(({}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#36414e',
    color: 'white',
    paddingLeft: 'auto', // Agrega paddingLeft
    paddingRight: 'auto', // Agrega paddingRight
    paddingTop: '4px', // Si también quieres ajustar paddingTop y paddingBottom
    paddingBottom: '4px',
    textAlign: 'center', // Agrega paddingBottom
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#c9ccd2',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const Tabla = ({ respuestas, columnas, fetchData, modo, id_tarea }) => {
  const { logout } = useContext(UserContext);
  const [formData, setFormData] = useState(null);
  const [nuevaPregunta, setNuevaPregunta] = useState(null);
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState(null);
  const [modalRol, setModalRol] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState('');
  const [rol, setRol] = useState(null);
  const [allRol, setAllRol] = useState(null);
  const [delRol, setDelRol] = useState(null);
  const [cambios, setCambios] = useState([]);
  console.log('columnas', columnas);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null); // Para almacenar los datos del popover
  /*   const [updatePregunta, setUpdatePregunta] = useState(null);
   */ const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  useEffect(() => {
    const data = async () => {
      try {
        const resp = await getPuestos(logout);
        setAllRol(resp);
      } catch (error) {
        console.log('errororroror', error);
      }
    };
    data();
  }, []);

  useEffect(() => {
    if (modo === 'Edicion') {
      filtrarRol();
    }
  }, [columnas, modo]);

  function filtrarRol() {
    console.log('Paso por filtrarRol', columnas);
    const rolesIds = new Set(columnas.map((role) => role.idRol));

    const puestosFiltrados = allRol.filter(
      (puesto) => !rolesIds.has(puesto.id_puesto)
    );

    console.log('filtrados', puestosFiltrados);
    setRoles(puestosFiltrados);
  }

  useEffect(() => {
    setCambios([]);
  }, [id_tarea]);

  const handleUpdate = async (e) => {
    console.log('esto es lo que recibo ...', e);
    const { id_respuesta, id_rol, respuesta_rol } = e;
    const newResp = respuesta_rol === 'Si' ? 'No' : 'Si';

    const updatedData = { id_respuesta, id_rol, respuesta: newResp };
    setLoader(true);
    setCambios((prev) => [
      ...prev,
      { id_respuesta: parseInt(id_respuesta), id_rol: parseInt(id_rol) },
    ]);

    try {
      await updateRespuesta(logout, updatedData);
      setLoader(false);
      snackbarUpdate();
      await fetchData();
    } catch (error) {
      snackbarError();
    }

    // Llama a `updateRespuestas` para actualizar la tabla
  };

  const isChange = (id_respuesta, id_rol) => {
    const cambioExiste = cambios.some(
      (el) => el.id_respuesta === id_respuesta && el.id_rol === id_rol
    );

    return cambioExiste ? 'text-red-700 font-boldt text-lg' : '';
  };

  const handlePreguntas = (action, e) => {
    console.log('action', action);
    const {
      id_pregunta = -1,
      pregunta,
      id_columna,
      id_tarea,
    } = e.currentTarget.dataset;
    console.log(id_pregunta, pregunta, id_columna, id_tarea);
    setFormData({
      id_pregunta: id_pregunta,
      id_tarea: id_tarea,
      columna: id_columna,
      pregunta: pregunta,
      action: action,
    });

    setAnchorEl(e.currentTarget);
  };

  const handleRol = (e) => {
    const { id_pregunta } = e.target.dataset;
    setModalRol({ id_pregunta: id_pregunta });
    setAnchorEl(e.currentTarget);
  };

  const addRol = () => {
    setRol((prev) => ({
      ...prev,
      id_pregunta: modalRol.id_pregunta,
      id_rol: selectedRoles,
      respuesta: 'Si',
    }));
  };

  /* id_respuesta, id_rol, respuesta */

  useEffect(() => {
    const fetchRol = async () => {
      if (!rol) return;
      try {
        await postRespuesta(logout, rol);

        setLoader(true);
        snackbarUpdate();
        const resp = await fetchData();
        console.log('Esta es la respuesta .... ', resp);
        console.log('ROLLLLLLL ...... ', rol);

        const newRespuesta = resp.filter(
          (el) =>
            el.id_pregunta === parseInt(rol.id_pregunta) &&
            el.id_rol === parseInt(rol.id_rol)
        );

        handleUpdate(newRespuesta[0]);

        handleClosePopover();
        setLoader(false);
      } catch (error) {
        console.log('error al insertar Rol', error);
      }
    };
    fetchRol();
  }, [rol]);

  const handlePreguntaChange = (e) => {
    console.log('eeeeeeeeee', e.target);
    const { name, value } = e.target;

    console.log(name, value, e.target);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  /*  useEffect(() => {
    alert('paso por respuestas ');
  }, [respuestas]); */

  const actualizarPreguntas = async () => {
    const funcion =
      formData.action === 'updatePregunta' ? updatePregunta : postPregunta;
    try {
      setLoader(true);
      await funcion(logout, formData);
      snackbarUpdate();
      await fetchData();
      handleClosePopover();
    } catch (error) {
      snackbarError();
    } finally {
      setLoader(false);
    }
  };

  const newValue = async (e) => {
    const { id_pregunta, id_rol } = e.currentTarget.dataset;
    const newResp = 'Si';
    const updatedData = { id_pregunta, id_rol, respuesta: newResp };
    setLoader(true);

    try {
      await postRespuesta(logout, updatedData);
      setLoader(false);
      snackbarUpdate();
      await fetchData();
    } catch (error) {
      snackbarError();
    }
  };

  const handleContextMenu = (e, resp) => {
    console.log('resp', resp);
    e.preventDefault(); // Evita el menú contextual por defecto
    setAnchorEl(e.currentTarget); // Establece el elemento donde se debe anclar el popover
    setPopoverData(resp); // Establece los datos para mostrar en el popover
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Cierra el popover
    setPopoverData(null);
    setFormData(null);
    setPopoverData(null);
    setNuevaPregunta(null);
    setModalRol(null);
    setDelRol(null);
  };

  const handleContextMenuDelRol = (e, resp) => {
    console.log('resp', resp);
    e.preventDefault(); // Evita el menú contextual por defecto
    setAnchorEl(e.currentTarget); // Establece el elemento donde se debe anclar el popover
    setDelRol(resp); // Establece los datos para mostrar en el popover
  };

  const open = Boolean(anchorEl);

  const handleConfirm = async (tipo, id) => {
    // Lógica para cuando el usuario presiona "Sí"
    const endpoint = tipo === 'pregunta' ? deletePregunta : deleteRespuesta;
    setLoader(true);
    try {
      await endpoint(logout, id);
      await fetchData();
      setLoader(false);
      snackbarDelete();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      handleClosePopover(); // Cierra el popover
    }
  };

  const handleCancel = () => {
    // Lógica para cuando el usuario presiona "Cancelar"
    console.log('Usuario canceló');

    handleClosePopover(); // Cierra el popover
  };

  const handleConfirmDelRol = async (id_tarea, id_puesto) => {
    try {
      await deleteRol(logout, id_tarea, id_puesto);
      await fetchData();
      setLoader(false);
      snackbarDelete();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      handleClosePopover(); // Cierra el popover
    }
  };

  const snackbarError = () => {
    setSnackbar({
      open: true,
      severity: 'error',
      message: 'Se produjo un error',
    });
  };
  const snackbarPost = () => {
    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Elemento agregado exitosamente',
    });
  };
  const snackbarDelete = () => {
    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Elemento eliminado exitosamente',
    });
  };
  const snackbarUpdate = () => {
    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Elemento actualizado exitosamente',
    });
  };

  return (
    <TableContainer sx={{ height: '100%', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <div className="flex gap-3">
                Preguntas
                {modo === 'Edicion' && (
                  <>
                    <Tooltip
                      title={
                        modo === 'Edicion' &&
                        'Click con boton derecho para insertar una pregunta'
                      }
                      placement="bottom"
                      sx={{
                        '& .MuiTooltip-tooltip': {
                          transform: 'translateY(-50px)', // Ajusta este valor según sea necesario
                        },
                      }}
                    >
                      <button
                        className={`pl-2 pr-2 bg-blue-500 text-white rounded mb-2`}
                        data-id_tarea={id_tarea}
                        data-pregunta=""
                        data-columna=""
                        /*   onClick={(e) => addPregunta(e)} */
                        onClick={(e) => handlePreguntas('postPregunta', e)}
                      >
                        +
                      </button>
                    </Tooltip>
                  </>
                )}
              </div>
            </StyledTableCell>
            <StyledTableCell>Tipo</StyledTableCell>
            {columnas.map((col, index) => {
              return (
                <StyledTableCell
                  key={`${col.nombreRol}-${index}`}
                  onContextMenu={
                    modo === 'Edicion'
                      ? (e) =>
                          handleContextMenuDelRol(e, {
                            id_tarea: id_tarea,
                            id_rol: col.idRol,
                          })
                      : undefined
                  }
                >
                  {col.nombreRol}
                </StyledTableCell>
              );
            })}
            {modo === 'Edicion' ? <StyledTableCell>Rol +</StyledTableCell> : ''}
          </TableRow>
        </TableHead>
        <TableBody>
          {respuestas.map((rows, index) => (
            <TableRow
              key={`${rows.idPregunta}-${index}`}
              sx={{
                backgroundColor: rows.columna === 1 ? '#A9BCD480' : '#ffffff',

                borderBottom: '2px solid #36414e', // Borde horizontal entre filas
                // Alterna los colores
              }}
            >
              <StyledTableCell sx={{ textAlign: 'left !important' }}>
                <span
                  data-pregunta={rows.pregunta}
                  data-id_pregunta={rows.idPregunta}
                  data-id_tarea={id_tarea}
                  data-id_columna={rows.columna}
                  onContextMenu={
                    modo === 'Edicion'
                      ? (e) =>
                          handleContextMenu(e, { id_pregunta: rows.idPregunta })
                      : undefined
                  }
                  onClick={
                    modo === 'Edicion'
                      ? (e) => handlePreguntas('updatePregunta', e)
                      : undefined
                  }
                >
                  {rows.pregunta}
                </span>
              </StyledTableCell>

              <StyledTableCell>
                {rows.columna === 1 ? 'Peligro' : 'Barrera'}
              </StyledTableCell>
              {columnas.map((col, index) => {
                // Busca si hay una respuesta para este idRol
                const respuestaCorrespondiente = rows.respuestas.find(
                  (resp) => resp.idRol === col.idRol
                );

                // Si no hay respuesta, muestra "sin datos"
                return (
                  <StyledTableCell key={`${rows.idPregunta}-${index}`}>
                    {respuestaCorrespondiente ? (
                      <Tooltip
                        title={modo === 'Edicion' && 'click para cambiar'}
                        placement="bottom"
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            transform: 'translateY(-50px)', // Ajusta este valor según sea necesario
                          },
                        }}
                      >
                        <span
                          style={{ cursor: 'pointer' }}
                          data-id_respuesta={
                            respuestaCorrespondiente.id_respuesta
                          }
                          data-id_rol={respuestaCorrespondiente.idRol}
                          data-respuesta_rol={
                            respuestaCorrespondiente.respuesta
                          }
                          onClick={
                            modo === 'Edicion'
                              ? (e) => handleUpdate(e.currentTarget.dataset)
                              : undefined
                          } // Se ejecuta solo si está en modo "Edicion"
                          onContextMenu={
                            modo === 'Edicion'
                              ? (e) =>
                                  handleContextMenu(e, respuestaCorrespondiente)
                              : undefined
                          } // Se ejecuta solo si está en modo "Edicion"
                        >
                          <label
                            className={isChange(
                              respuestaCorrespondiente.id_respuesta,
                              respuestaCorrespondiente.idRol
                            )}
                          >
                            {respuestaCorrespondiente.respuesta}
                          </label>
                        </span>
                      </Tooltip>
                    ) : (
                      <span
                        data-id_pregunta={rows.idPregunta}
                        /*  data-id_respuesta={
                          respuestaCorrespondiente.id_respuesta
                        } */
                        data-id_rol={col.idRol}
                        /*  data-respuesta={respuestaCorrespondiente.respuesta} */
                        onClick={modo === 'Edicion' ? newValue : undefined}
                        className="bg-blue-500"
                        style={{
                          width: '50px',
                          height: '10px',
                          display: 'inline-block', // Asegura que el span tenga área de clic
                          minWidth: '50px', // Establece un ancho mínimo
                          minHeight: '20px', // Establece una altura mínima
                          opacity: '0.2',
                          cursor: 'pointer',
                        }}
                      >
                        {' '}
                        {/* Si data está vacío, muestra un espacio */}
                      </span>
                    )}
                  </StyledTableCell>
                );
              })}

              {modo === 'Edicion' ? (
                <StyledTableCell>
                  <Tooltip
                    title={modo === 'Edicion' && 'Insertar rol'}
                    placement="bottom"
                    sx={{
                      '& .MuiTooltip-tooltip': {
                        transform: 'translateY(-50px)', // Ajusta este valor según sea necesario
                      },
                    }}
                  >
                    <button
                      className={`pl-2 pr-2 bg-blue-500 text-white rounded mb-2`}
                      data-id_pregunta={rows.idPregunta}
                      /*   onClick={(e) => addPregunta(e)} */
                      onClick={
                        modo === 'Edicion' ? (e) => handleRol(e) : undefined
                      }
                    >
                      +
                    </button>
                  </Tooltip>
                </StyledTableCell>
              ) : (
                ''
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            width: popoverData ? 'auto' : '400px', // Cambia el ancho del Popover
            height: 'auto',
            padding: '10px', // Cambia la altura del Popover
          },
        }}
      >
        {popoverData && (
          <div style={{ padding: '16px' }}>
            <Typography sx={{ mb: 2 }}>
              {popoverData?.id_pregunta
                ? '¿Deseas eliminar la pregunta ?'
                : '¿Deseas eliminar la respuesta ?'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleConfirm(
                  popoverData?.id_pregunta ? 'pregunta' : 'respuesa',
                  popoverData?.id_pregunta
                    ? popoverData.id_pregunta
                    : popoverData.id_respuesta
                )
              }
              sx={{ mr: 2 }}
            >
              Sí
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              No
            </Button>
          </div>
        )}

        {formData && (
          <>
            <div className="flex justify-center p-2 font-bold">
              {formData.action === 'updatePregunta'
                ? 'MODIFICAR PREGUNTA'
                : ' NUEVA PREGUNTA'}
            </div>

            <div className="flex flex-col gap-3 items-center justify-center">
              <TextField
                value={formData.pregunta}
                className="w-11/12"
                name="pregunta"
                onChange={(e) => handlePreguntaChange(e)}
                rows={2}
                multiline
              />
              <FormControl className="w-11/12" size="small">
                <InputLabel id="select-label">Peligro/Barrera</InputLabel>
                <Select
                  labelId="select-label"
                  label="Columna"
                  name="columna"
                  value={formData.columna}
                  onChange={(e) => handlePreguntaChange(e)}
                >
                  <MenuItem value={1}>
                    Visualizar en columna de Peligros (1)
                  </MenuItem>
                  <MenuItem value={2}>
                    Visualizar en columna de Barreras (2)
                  </MenuItem>
                </Select>
              </FormControl>

              <div className="pt-2">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!(formData.pregunta && formData.columna)}
                  onClick={() => actualizarPreguntas()}
                  sx={{ mr: 2 }}
                >
                  Sí
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  No
                </Button>
              </div>
            </div>
          </>
        )}

        {modalRol && (
          <>
            <div className="flex justify-center p-2 font-bold">NUEVO ROL</div>

            <div className="flex flex-col gap-3 items-center justify-center">
              <FormControl fullWidth size="small" sx={{ flex: 0.8 }}>
                <InputLabel id="select-label">Rol</InputLabel>
                <Select
                  labelId="select-rol"
                  label="Rol"
                  value={selectedRoles}
                  onChange={(e) => setSelectedRoles(e.target.value)}
                >
                  {roles.length > 0 &&
                    roles.map((data, index) => (
                      <MenuItem key={index} value={data.id_puesto}>
                        {data.nombre_puesto}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <div className="pt-2">
                <Button
                  variant="contained"
                  id={id_tarea}
                  color="primary"
                  disabled={!selectedRoles}
                  onClick={() => addRol()}
                  sx={{ mr: 2 }}
                >
                  Sí
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  No
                </Button>
              </div>
            </div>
          </>
        )}

        {delRol && (
          <div style={{ padding: '16px' }}>
            <Typography sx={{ mb: 2 }}>{`Deseas eliminar el rol ?`}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleConfirmDelRol(delRol.id_tarea, delRol.id_rol)
              }
              sx={{ mr: 2 }}
            >
              Sí
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              No
            </Button>
          </div>
        )}
      </Popover>
      <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      <Loader open={loader} text={'Actualizando datos'} />
    </TableContainer>
  );
};
