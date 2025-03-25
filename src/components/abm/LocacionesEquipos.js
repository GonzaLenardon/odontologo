import React, { useEffect, useState } from 'react'
import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { getEquipos } from '../../api/locacionesEquipos/getEquipos';
import { deleteEquipo } from '../../api/locacionesEquipos/deleteEquipo';
import { postEquipo } from '../../api/locacionesEquipos/postEquipo';
import { updateEquipo } from '../../api/locacionesEquipos/updateEquipo';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import YesNoDialog from '../dialogs/YesNoDialog';
import CSnackbar from '../elements/CSnackbar';


export default function LocacionesEquipos() {
  const { logout } = useUserContext();
  const [loading, setLoading] = useState()
  const [snackbar, setSnackbar] = useState({open: false, severity: "success", message: ""})
  const snackbarError = () => {setSnackbar({open: true, severity: "error", message: "Se produjo un error"})}
  const snackbarPost = () => {setSnackbar({open: true, severity: "success", message: "Elemento agregado exitosamente"})}
  const snackbarDelete = () => {setSnackbar({open: true, severity: "success", message: "Elemento eliminado exitosamente"})}
  const snackbarUpdate = () => {setSnackbar({open: true, severity: "success", message: "Elemento actualizado exitosamente"})}

  const [mode, setMode] = useState("post")
  const [formTitle, setFormTitle] = useState()
  const [selectedItem, setSelectedItem] = useState()

  const [openDialog, setOpenDialog] = useState(false)
  const [dialog, setDialog] = useState({title: "", description: ""})

  const [items, setItems] = useState([])


  const createTitle = "Crear Nuevo Equipo"
  const editTitle = "Editar Equipo"

  const defaultData = {
    id_equipo: -1,
    nombre_equipo: "",
    email_equipo : "",
  }

  const [formData, setFormData] = useState(defaultData)

  useEffect(() => {
    fetchData()
    setMode("post")
  }, [])

  useEffect(() => {
    switch (mode) {
      case "post":
        setFormTitle(createTitle)
        setFormData(defaultData)
        break;
      case "update":
        setFormTitle(editTitle)
        setFormData({
            id_equipo: items[selectedItem].id_ubicacion,
            nombre_equipo:  items[selectedItem].nombre_ubicacion,
            email_equipo : items[selectedItem].email_equipo,
        } )
        break;
      default:
        break;
    }
  }, [selectedItem, mode])

  
  const fetchData = async() => {
    setLoading(true)
    try {
        const response = await getEquipos(logout, )
        setItems(response)
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
        await deleteEquipo(logout, id)
        fetchData()
        snackbarDelete()
    } catch (error) {
        console.log(error)
        snackbarError()
    }finally{setLoading(false)}
  }

  const handleFormSubmit = async(e) => {
    setLoading(true)
    e.preventDefault()
    try {
      var response 
      if (mode === "post"){
        response = await postEquipo(logout, formData)
        snackbarPost()
      }
      if (mode === "update"){
        response = await updateEquipo(logout, formData)
        snackbarUpdate()
      }
      console.log("submit response", response)
      setMode("post")
      setFormData(defaultData)
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
        <List dense={false}>
          {items.length > 0 && items.map((data, index) => (
            <ListItem key={index} className='border-b'>
                <ListItemText className='flex' primary={data.nombre_ubicacion} />
                <div className='flex gap-2'>
                    <IconButton edge="end" 
                        onClick={() => handleDeleteDialog(data.id_ubicacion)}>
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
            <TextField label="Nombre equipo/locación" fullWidth size='small'
                value={formData.nombre_equipo}
                onChange={e => updateFormData("nombre_equipo",e.target.value)}
            />
            <TextField label="Email" fullWidth size='small'
                value={formData.email_equipo}
                onChange={e => updateFormData("email_equipo",e.target.value)}
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
