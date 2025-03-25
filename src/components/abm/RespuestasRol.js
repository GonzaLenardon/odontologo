import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { getPreguntas } from '../../api/preguntas/getPreguntas';
import { getTareas } from '../../api/tareas/getTareas';
import { getRespuestas } from '../../api/respuestas/getRespuestas';
import { getPuestos } from '../../api/puestos/getPuestos';
import { updateRespuesta } from '../../api/respuestas/updateRespuesta';
import CDialog from '../dialogs/CDialog';
import { postRespuesta } from '../../api/respuestas/postRespuesta';
import { deleteRespuesta } from '../../api/respuestas/deleteRespuesta';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import CSnackbar from '../elements/CSnackbar';
import YesNoDialog from '../dialogs/YesNoDialog';

export default function RespuestasRol() {
  const { logout } = useUserContext();

  const [mode, setMode] = useState('post');
  const [formTitle, setFormTitle] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedTarea, setSelectedTarea] = useState('');
  const [loading, setLoading] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState({ title: '', description: '' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
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

  const [items, setItems] = useState([]);
  const [tareas, setTareas] = useState([]);

  //todos los roles
  const [roles, setRoles] = useState([]);
  //roles para agregar
  const [rolAddItems, setRolAddItems] = useState([]);

  const [respuestas, setRespuestas] = useState([]);

  const createTitle = 'Elige una pregunta para editar sus respuestas';
  const editTitle = 'Editar Respuestas';

  const [respuestaItems, setRespuestaItems] = useState([]);

  const defaultData = {
    id_pregunta: '',
    id_rol: '',
    respuesta: '',
  };
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    fetchTareasRoles();
  }, []);

  useEffect(() => {
    selectedTarea && fetchData();
    setMode('post');
  }, [selectedTarea]);

  useEffect(() => {
    selectedItem && updateFormData('id_pregunta', selectedItem.id_pregunta);
    console.log('selectedItem', selectedItem);
    switch (mode) {
      case 'post':
        setFormTitle(createTitle);
        break;
      case 'update':
        setFormTitle(editTitle);
        fetchRespuestas();
        break;
      default:
        break;
    }
  }, [selectedItem, mode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPreguntas(logout, selectedTarea);
      setItems(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchTareasRoles = async () => {
    setLoading(true);
    try {
      const tareasresponse = await getTareas(logout);
      setTareas(tareasresponse);
      const response = await getPuestos(logout);
      setRoles(response);
    } catch (error) {
      console.log('error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRespuestas = async () => {
    setLoading(true);
    try {
      const response = await getRespuestas(logout, selectedItem.id_pregunta);
      setRespuestas(response);
      rolesToAdd(response);
      setRespuestaItems(
        response.map((item) => {
          const { respuesta_correcta, id_pregunta, ...rest } = item;
          return {
            ...rest,
            respuesta: respuesta_correcta,
          };
        })
      );
    } catch (error) {
      console.log('error respuestas', error);
    } finally {
      setLoading(false);
    }
  };

  const setRolName = (id) => {
    const rolname = roles.find((r) => r.id_puesto === id)?.nombre_puesto;

    return rolname !== undefined ? rolname : '';
  };

  const updateFormData = (field, newValue) => {
    console.log(newValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: newValue,
    }));
  };

  const rolesToAdd = (respRoles) => {
    var result = roles;
    for (let index = 0; index < respRoles.length; index++) {
      result = result.filter(
        (item) => item.id_puesto !== respRoles[index].id_rol
      );
    }
    setRolAddItems(result);
  };

  const handleDeleteDialog = async (id) => {
    setOpenDialog(true);
    setDialog({
      title: 'Eliminar Elemento',
      description: 'Desea eliminar?',
      action: () => handleDelete(id),
    });
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteRespuesta(logout, id);
      snackbarDelete();
      fetchRespuestas();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === 'create') {
        await updateRespuestas();
        await postRespuesta(logout, formData);
        snackbarPost();
        fetchRespuestas();
        setMode('update');
      }
      if (mode === 'update') {
        await updateRespuestas();
        snackbarUpdate();
        setMode('post');
        fetchData();
      }
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading(false);
    }
  };

  const updateRespuestas = async () => {
    for (let index = 0; index < respuestaItems.length; index++) {
      if (
        respuestaItems[index].respuesta !== respuestas[index].respuesta_correcta
      ) {
        await updateRespuesta(logout, respuestaItems[index]);
      }
    }
  };

  const updateFormItem = (index, field, newValue) => {
    var updatedData = [...respuestaItems];
    updatedData[index][field] = newValue;
    console.log(updatedData);
    setRespuestaItems(updatedData);
  };

  const addRolForm = (
    <div className="flex flex-col gap-3 w-full">
      <FormControl fullWidth className="flex m-2">
        <InputLabel id="select-label">Seleccionar Puesto</InputLabel>
        <Select
          labelId="select-label"
          label="Seleccionar Puesto"
          value={formData.id_rol}
          onChange={(e) => updateFormData('id_rol', e.target.value)}
        >
          {rolAddItems.length > 0 &&
            rolAddItems.map((data, index) => (
              <MenuItem key={index} value={data.id_puesto}>
                {data.nombre_puesto}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id={`select-label`}>Respuesta</InputLabel>
        <Select
          labelId={`select-label`}
          label="Respuesta"
          value={formData.respuesta}
          onChange={(e) => updateFormData('respuesta', e.target.value)}
        >
          <MenuItem value={'Si'}>Si</MenuItem>
          <MenuItem value={'No'}>No</MenuItem>
        </Select>
      </FormControl>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-row gap-6">
      <div className="ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[40%] h-full overflow-auto">
        <FormControl fullWidth size="small">
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
        <List dense={false}>
          {items.length > 0 &&
            items.map((data, index) => (
              <ListItem key={index} className="border-b">
                <ListItemText className="flex" primary={data.nombre_pregunta} />
                <div className="flex gap-2">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setMode('update');
                      setSelectedItem(data);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </ListItem>
            ))}
        </List>
      </div>

      <div className="ccontainer-noblur w-[60%] h-full flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="text-xl m-auto flex items-center justify-center">
            {' '}
            {formTitle}
          </div>
          {mode !== 'post' && (
            <IconButton
              className="text-xl m-auto"
              onClick={() => setMode('post')}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>

        {mode !== 'post' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="text-xl m-auto gap-3">
              {' '}
              {selectedItem.nombre_pregunta}
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-3 max-w-[800px] w-full m-auto h-full overflow-auto"
            >
              <div className="flex flex-col my-auto">
                {respuestaItems.map((data, index) => (
                  <div key={index} className="flex flex-col gap-1 ">
                    <FormLabel className="flex m-2">
                      {data.id_rol && setRolName(data.id_rol)}
                    </FormLabel>
                    <div className=" flex flex-row">
                      <IconButton
                        onClick={() => handleDeleteDialog(data.id_respuesta)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-label-${index}`}>
                          Respuesta
                        </InputLabel>
                        <Select
                          labelId={`select-label-${index}`}
                          label="Respuesta"
                          value={data.respuesta}
                          onChange={(e) =>
                            updateFormItem(index, 'respuesta', e.target.value)
                          }
                        >
                          <MenuItem value={'Si'}>Si</MenuItem>
                          <MenuItem value={'No'}>No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                ))}
                <div className="my-3">
                  <CDialog
                    text={'Agregar Rol/Respuesta'}
                    button
                    children={addRolForm}
                    onClickAction={() => setMode('create')}
                    onSubmitAction={handleFormSubmit}
                  />
                </div>
              </div>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  marginBlock: 'auto',
                  height: '50px',
                  backgroundColor: ' rgb(71 85 105)',
                }}
              >
                {' '}
                Aceptar{' '}
              </Button>
            </form>
          </div>
        )}
      </div>

      <div className="flex absolute">
        <Loader open={loading} />
        <YesNoDialog
          title={dialog.title}
          description={dialog.description}
          action={dialog.action}
          open={openDialog}
          setOpen={setOpenDialog}
        />
        <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      </div>
    </div>
  );
}
