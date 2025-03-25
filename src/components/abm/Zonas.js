import React, { useEffect, useState } from 'react'
import { Button, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { getTareas } from '../../api/tareas/getTareas';
import { getZonas } from '../../api/zonas/getZonas';
import { deleteZona } from '../../api/zonas/deleteZona';
import { postZona } from '../../api/zonas/postZona';
import { updateZona } from '../../api/zonas/updateZona';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import CSnackbar from '../elements/CSnackbar';
import YesNoDialog from '../dialogs/YesNoDialog';


export default function Zonas() {
  const { logout } = useUserContext();
  const [loading, setLoading] = useState()

  const [snackbar, setSnackbar] = useState({open: false, severity: "success", message: ""})
  const snackbarError = () => {setSnackbar({open: true, severity: "error", message: "Se produjo un error "})}
  const snackbarPost = () => {setSnackbar({open: true, severity: "success", message: "Elemento agregado exitosamente"})}
  const snackbarDelete = () => {setSnackbar({open: true, severity: "success", message: "Elemento eliminado exitosamente"})}
  const snackbarUpdate = () => {setSnackbar({open: true, severity: "success", message: "Elemento actualizado exitosamente"})}
  const [openDialog, setOpenDialog] = useState(false)
  const [dialog, setDialog] = useState({title: "", description: ""})
  
  const [mode, setMode] = useState("post")
  const [formTitle, setFormTitle] = useState()
  const [selectedItem, setSelectedItem] = useState()
  const [selectedTarea, setSelectedTarea] = useState("")

  const [items, setItems] = useState([])
  const [tareas, setTareas] = useState([])


  const createTitle = "Crear Nueva Zona"
  const editTitle = "Editar Zona"

  const defaultData = {
    id_zona: -1,
    id_tarea: 1,
    nombre_zona: "",
  }

  const [formData, setFormData] = useState(defaultData)


  useEffect(() => {
    fetchTareas()
  }, [])

  useEffect(() => {
    updateFormData("id_tarea", selectedTarea)
    fetchData()
    setMode("post")
  }, [selectedTarea])

  useEffect(() => {
    switch (mode) {
      case "post":
        setFormTitle(createTitle)
        setFormData(defaultData)
        break;
      case "update":
        setFormTitle(editTitle)
        setFormData({
            id_zona: items[selectedItem].id_zona,
            id_tarea:  items[selectedItem].id_tarea,
            nombre_zona: items[selectedItem].nombre_zona
        } )
        break;
      default:
        break;
    }
  }, [selectedItem, mode])

  
  const fetchData = async() => {
    setLoading(true)
    try {
        const response = await getZonas(logout, selectedTarea)
        setItems(response)
    } catch (error) {
        
    }finally{setLoading(false)}
  }


  const fetchTareas= async() => {
    setLoading(true)
    try {
      const tareasresponse = await getTareas(logout, )
      setTareas(tareasresponse)
    } catch (error) {
        
    }finally{setLoading(false)}
  }
  

  const handleDeleteDialog =  async(id) => {
    setOpenDialog(true)
    setDialog({title: "Eliminar Elemento", description: "Desea eliminar?", action: () => handleDelete(id)}) 
  }
  const handleDelete =  async(id) => {
    setLoading(true)
    try {
        await deleteZona(logout, id)
        snackbarDelete() 
        fetchData()
    } catch (error) {
        console.log(error)
        snackbarError()
    }finally{setLoading(false)

    }
  }

  const handleFormSubmit = async(e) => {
    setLoading(true)
    e.preventDefault()
    try {
      if (mode === "post") {
        await postZona(logout, formData)
        snackbarPost()

      } 
      if (mode === "update") {
        await updateZona(logout, formData)
        snackbarUpdate()
      } 
      setMode("post")
      snackbarPost()
      setFormData(defaultData)
      updateFormData("id_tarea", selectedTarea)
      fetchData()
    } catch (error) {
      console.log(error)
      snackbarError()
    }finally{setLoading(false)}
  };

  const updateFormData = (field, newValue) => {
    console.log(newValue)
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: newValue
    }));
  };

  return (
    <div className='w-full h-full flex flex-row gap-6'>
      
      <div className='ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[40%] h-full overflow-auto'>
        <FormControl fullWidth size='small'>
          <InputLabel id="select-label">Tarea</InputLabel>
          <Select
              labelId="select-label"
              label="Tarea"
              value={selectedTarea}
              onChange={e => setSelectedTarea(e.target.value)}
          >
              {tareas.length > 0 && tareas.map((data,index) => (
                  <MenuItem key={index} value={data.id_tarea}>{data.nombre_tarea}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <List dense={false}>
          {items.length > 0 && items.map((data, index) => (
            <ListItem key={index} className='border-b'>
                <ListItemText className='flex' primary={data.nombre_zona} />
                <div className='flex gap-2'>
                    <IconButton edge="end" 
                        onClick={() => handleDeleteDialog(data.id_zona)}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton edge="end" 
                        onClick={() => {
                        setMode("update")
                        setSelectedItem(index)}
                        }>
                        <EditIcon/>
                    </IconButton>
                </div>
            </ListItem>
          ))}
        </List>
      </div>

      <div className='ccontainer-noblur w-[60%] h-full flex flex-col gap-4'>
        <div className='flex flex-row'>
            <div className='text-xl m-auto'> {formTitle}</div>
            {mode==="update" && <IconButton  className='text-xl m-auto' onClick={() => setMode("post")}><CloseIcon/></IconButton>}
        </div>
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-3 max-w-[800px] w-full h-full mx-auto'>
            <TextField label="Nombre zona" fullWidth size='small'
                value={formData.nombre_zona}
                onChange={e => updateFormData("nombre_zona",e.target.value)}
            />
          <Button variant="contained" type='submit' sx={{ marginTop:"auto", height:"50px", backgroundColor:" rgb(71 85 105)"}}> Aceptar </Button>
        </form>
      </div>

      <div className='flex absolute'>
        <Loader open={loading}/>
        <YesNoDialog title={dialog.title} description={dialog.description} action={dialog.action} open={openDialog} setOpen={setOpenDialog} />
        <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      </div>

    </div>
  )
}
