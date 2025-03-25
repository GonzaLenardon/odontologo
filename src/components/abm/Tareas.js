import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTareas } from '../../api/tareas/getTareas';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTarea } from '../../api/tareas/deleteTarea';
import { postTarea } from '../../api/tareas/postTarea';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { updateTarea } from '../../api/tareas/updateTarea';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import CSnackbar from '../elements/CSnackbar';
import YesNoDialog from '../dialogs/YesNoDialog';
import { Close, VideoFile } from '@mui/icons-material';
import { videoUpload } from '../../api/files/videoUpload';
import { generateMd5Hash } from '../../utils/generateMd5Hash';
import { cleanFileName, cleanFilePath } from '../../utils/cleanFileName';

export default function Tareas() {
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const [loading, setLoading] = useState({ open: false, text: null });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const snackbarError = (info) => {
    setSnackbar({
      open: true,
      severity: 'error',
      message: 'Se produjo un error ' + info,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState({ title: '', description: '' });

  const [mode, setMode] = useState('post');
  const [formTitle, setFormTitle] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);
  const [auxFile, setAuxFile] = useState();
  const [idTarea, setIdTarea] = useState(0);

  const [tareas, setTareas] = useState([]);

  const defaultData = {
    id_tarea: -1,
    id_usuario: '',
    nombre_tarea: '',
    /*    url_video: '/dcim/ATS Digital/Videos/', */
    url_video: ' ',
    porcentaje_aprobacion: 100,
    md5_video: '',
    estado_tarea: 0,
  };
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    fetchTareas();
  }, []);

  useEffect(() => {
    setSelectedVideo(null);
    switch (mode) {
      case 'post':
        setFormTitle('Crear Nueva Tarea');
        setFormData(defaultData);
        break;
      case 'update':
        console.log('idTarea ', idTarea);
        setFormTitle('Editar Tarea');
        setFormData({
          ...tareas[selectedItem],
          url_video: tareas[selectedItem].video_tarea,
        });

        break;
      default:
        break;
    }
  }, [selectedItem, mode]);

  const fetchTareas = async () => {
    setLoading({ open: true });
    try {
      const response = await getTareas(logout);
      console.log('tareas ', response);
      setTareas(response);
    } catch (error) {
    } finally {
      setLoading({ open: false });
    }
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
    setLoading({ open: true });
    try {
      await deleteTarea(logout, id);
      fetchTareas();
      snackbarDelete();
    } catch (error) {
      snackbarError('eliminando tarea');
    } finally {
      setLoading({ open: false });
    }
  };

  const handleFormSubmit = async (e) => {
    setLoading({ open: true });
    e.preventDefault();
    try {
      var response;
      var videoMd5 = '111111';

      if (selectedVideo) {
        console.log('paso x selected Video');
        setLoading({
          open: true,
          text: 'Subiendo video, no cierre la ventana',
        });
        videoMd5 = await generateMd5Hash(selectedVideo);
        await videoUpload(logout, selectedVideo);

        // Actualizar formData.url_video con el nombre del archivo seleccionado
        formData.url_video = selectedVideo.name;
      } else {
        // Si no hay archivo seleccionado, extraer el nombre del archivo de formData.url_video
        console.log('paso x NOOOOOO selected Vider ');
        formData.url_video = obtenerNombreArchivo(formData.url_video);
      }

      if (selectedVideo === null) {
        console.log('paso x NOOOOOO selected Vider NULL ');
        formData.url_video = obtenerNombreArchivo(formData.url_video);
      }

      console.log('md5', videoMd5);

      if (mode === 'post') {
        setLoading({
          open: true,
          text: 'Subiendo elemento, no cierre la ventana',
        });
        response = await postTarea(logout, formData, videoMd5);
        snackbarPost();
      }

      if (mode === 'update') {
        response = await updateTarea(
          logout,
          (formData.id_usuario = localStorage.user.id_usuario),
          formData.nombre_tarea,
          formData.url_video, // Aquí ya está modificado para enviar solo el nombre del archivo
          formData.id_tarea,
          formData.porcentaje_aprobacion,
          selectedVideo ? videoMd5 : formData.md5_video,
          formData.estado_tarea
        );
        snackbarUpdate();
      }

      console.log('tarea response', response);
      setSelectedVideo(null);
      await fetchTareas();
      setFormData(defaultData);
      setMode('post');

      setTimeout(() => {
        setMode('update');
        setSelectedItem(idTarea);
      }, 500);
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading({ open: false });
    }
  };

  // Función para obtener el nombre del archivo de una URL
  function obtenerNombreArchivo(urlCompleta) {
    const partes = urlCompleta.split('/');
    return partes.pop(); // Retorna el último segmento de la URL (el nombre del archivo)
  }

  /*  const handleFormSubmit = async (e) => {
    setLoading({ open: true });
    e.preventDefault();
    try {
      var response;
      var videoMd5 = '111111';

      if (selectedVideo) {
        setLoading({
          open: true,
          text: 'Subiendo video, no cierre la ventana',
        });
        videoMd5 = await generateMd5Hash(selectedVideo);
        await videoUpload(logout, selectedVideo);
      }
      console.log('md5', videoMd5);

      if (mode === 'post') {
        setLoading({
          open: true,
          text: 'Subiendo elemento, no cierre la ventana',
        });
        response = await postTarea(logout, formData, videoMd5);
        snackbarPost();
      }
      if (mode === 'update') {
        response = await updateTarea(
          logout,
          formData.nombre_tarea,
          formData.url_video,
          formData.id_tarea,
          formData.porcentaje_aprobacion,
          selectedVideo ? videoMd5 : formData.md5_video,
          formData.estado_tarea
        );
        snackbarUpdate();
      }

      console.log('tarea response', response);
      fetchTareas();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading({ open: false });
    }
  };
 */
  const updateFormData = (field, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: newValue,
    }));
  };

  useEffect(() => {
  }, [formData]);

  useEffect(() => {
  }, [selectedVideo]);

  //manejo video seleccionado
  useEffect(() => {
    console.log('selectedVideo:', selectedVideo);
    if (selectedVideo != null) {
      setAuxFile(formData.url_video);
      const clearPath = cleanFilePath(formData.url_video);
      const videoName = cleanFileName(selectedVideo.name);
      updateFormData('url_video', clearPath + videoName);
    } else if (fileInputRef.current.value != '') {
      const cleanedPath = cleanFilePath(formData.url_video);
      updateFormData('url_video', auxFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedVideo]);

  return (
    <div className="w-full h-full flex flex-row gap-6">
      <div className="ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[40%] h-full overflow-auto">
        <List dense={false}>
          {tareas.length > 0 && tareas.map((data, index) => (
              <ListItem
                key={index}
                className="border-b"
                primary={data.nombre_tarea}
              >
                <ListItemText primary={data.nombre_tarea} />
                <div className="flex gap-2">
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteDialog(data.id_tarea)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setMode('update');
                      setSelectedItem(index);
                      setIdTarea(index);
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
          <div className="text-xl m-auto"> {formTitle}</div>
          {mode === 'update' && (
            <IconButton
              className="text-xl m-auto"
              onClick={() => {
                setMode('post');
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-3 max-w-[800px] w-full h-full mx-auto"
        >
          <TextField
            label="Nombre tarea"
            fullWidth
            size="small"
            value={formData.nombre_tarea}
            onChange={(e) => updateFormData('nombre_tarea', e.target.value)}
          />
          <div className="flex ">
            <TextField
              label="URL video en dispositivo"
              size="small"
              sx={{
                width: '65%',
                // Específicamente aplica el 65% de ancho aquí.
              }}
              value={formData.url_video}
              /*  onChange={(e) => updateFormData('url_video', e.target.value)} */
            />

            <Button
              sx={{
                height: '38px',
                display: 'flex',
                gap: '6px',
                width: '35%',
                marginLeft: '5px',
              }}
              variant="contained"
              color="primary"
              component="label"
            >
              <div className="flex flex-row justify-between gap-4">
                {!selectedVideo && (
                  <div className="m-auto text-xs">Seleccionar archivo</div>
                )}
                <VideoFile />
              </div>
              <input
                ref={fileInputRef}
                accept="video/*"
                type="file"
                hidden
                onChange={(e) => setSelectedVideo(e.target.files[0])}
              />
              {selectedVideo && (
                <div variant="body1" className=" text-ellipsis line-clamp-2">
                  {selectedVideo.name}
                </div>
              )}
            </Button>
            {selectedVideo && (
              <IconButton
                color="primary"
                onClick={(e) => setSelectedVideo(null)}
              >
                <Close />
              </IconButton>
            )}
          </div>
          <TextField
            label="Porcentaje Aprobación"
            fullWidth
            type="number"
            size="small"
            InputProps={{ inputProps: { max: 100, min: 1 } }}
            value={formData.porcentaje_aprobacion}
            onChange={(e) =>
              updateFormData('porcentaje_aprobacion', parseInt(e.target.value))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.estado_tarea === 1}
                onChange={(e) =>
                  updateFormData('estado_tarea', e.target.checked ? 1 : 0)
                }
              />
            }
            label="Habilitar tarea"
          />

          {/*     <div className="flex flex-row gap-2">
            <Button
              sx={{
                height: '40px',
                width: '30%',
                display: 'flex',
                gap: '6px',
              }}
              variant="contained"
              color="primary"
              component="label"
            >
              <div className="flex flex-row gap-3">
                {!selectedVideo && <div className="m-auto">Subir Archivo</div>}
                <VideoFile />
              </div>
              <input
                ref={fileInputRef}
                accept="video/*"
                type="file"
                hidden
                onChange={(e) => setSelectedVideo(e.target.files[0])}
              />
              {selectedVideo && (
                <div variant="body1" className=" text-ellipsis line-clamp-2">
                  {selectedVideo.name}
                </div>
              )}
            </Button>
            {selectedVideo && (
              <IconButton
                color="primary"
                onClick={(e) => setSelectedVideo(null)}
              >
                <Close />
              </IconButton>
            )}
          </div> */}
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: 'auto',
              height: '50px',
              backgroundColor: ' rgb(71 85 105)',
            }}
          >
            {' '}
            Aceptar{' '}
          </Button>
        </form>
      </div>

      <div className="flex absolute">
        <Loader open={loading.open} text={loading.text} />
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
