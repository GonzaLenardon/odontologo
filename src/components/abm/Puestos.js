import React, { useEffect, useState } from 'react'
import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { getPuestos } from '../../api/puestos/getPuestos';
import { deletePuesto } from '../../api/puestos/deletePuesto';
import { postPuesto } from '../../api/puestos/postPuesto';
import { updatePuesto } from '../../api/puestos/updatePuesto';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import CSnackbar from '../elements/CSnackbar';
import YesNoDialog from '../dialogs/YesNoDialog';




export default function Puestos() {
  const { logout } = useUserContext();
  const [loading, setLoading] = useState()
  const [snackbar, setSnackbar] = useState({open: false, severity: "success", message: ""})
  const snackbarError = () => {setSnackbar({open: true, severity: "error", message: "Se produjo un error"})}
  const snackbarPost = () => {setSnackbar({open: true, severity: "success", message: "Elemento agregado exitosamente"})}
  const snackbarDelete = () => {setSnackbar({open: true, severity: "success", message: "Elemento eliminado exitosamente"})}
  const snackbarUpdate = () => {setSnackbar({open: true, severity: "success", message: "Elemento actualizado exitosamente"})}
  const [openDialog, setOpenDialog] = useState(false)
  const [dialog, setDialog] = useState({title: "", description: ""})
  const [mode, setMode] = useState("post")
  const [formTitle, setFormTitle] = useState()
  const [selectedItem, setSelectedItem] = useState()

  const [items, setItems] = useState([])


  const createTitle = "Crear Nuevo Puesto"
  const editTitle = "Editar Puesto"

  const defaultData = {
    id_puesto: -1,
    nombre_puesto : "",
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
            id_puesto: items[selectedItem].id_puesto,
            nombre_puesto:  items[selectedItem].nombre_puesto,
        } )
        break;
      default:
        break;
    }
  }, [selectedItem, mode])

  
  const fetchData = async() => {
    setLoading(true)
    try {
        const response = await getPuestos(logout, )
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
        await deletePuesto(logout, id)
        snackbarDelete()
        fetchData()
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
        response = await postPuesto(logout, formData)
        snackbarPost()
      }
      if (mode === "update"){
        response = await updatePuesto(logout, formData)
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
                <ListItemText className='flex' primary={data.nombre_puesto} />
                <div className='flex gap-2'>
                    <IconButton edge="end" 
                        onClick={() => handleDeleteDialog(data.id_puesto)}>
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
            <TextField label="Nombre puesto" fullWidth size='small'
                value={formData.nombre_puesto}
                onChange={e => updateFormData("nombre_puesto",e.target.value)}
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
