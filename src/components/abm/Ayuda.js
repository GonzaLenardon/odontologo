import React, { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import Loader from '../elements/Loader';
import CSnackbar from '../elements/CSnackbar';
import YesNoDialog from '../dialogs/YesNoDialog';
import { getStreamings } from '../../api/streamings/getStreamings';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { getStreamingView } from '../../api/streamings/getStreamingView';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
export default function Ayuda() {
  const url = process.env.REACT_APP_API_URL
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

  const [title, setTitle] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedVideo, setSelectedVideo] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchListaVideos();
  }, []);

  useEffect(() => {
    console.log("selectedItem: ", selectedItem)
    if (selectedItem){
      //fetchVideo(selectedItem.url_video)
      setSelectedVideo(`${url}/ats/streamingview/${selectedItem.filename}`)
      setTitle(selectedItem.nombre_capacitacion)
    } 

  }, [selectedItem]);

  const fetchListaVideos = async () => {
    setLoading({ open: true });
    try {
      const response = await getStreamings(logout);
      console.log('streamings ', response);
      setItems(response);
    } catch (error) {
    } finally {
      setLoading({ open: false });
    }
  };


  const fetchVideo = async (videoName) => {
    setLoading({ open: true });
    try {
      const response = await getStreamingView(logout, videoName);
      console.log('fetchVideo ', response);
    } catch (error) {
    } finally {
      setLoading({ open: false });
    }
  };


  return (
    <div className="w-full h-full flex flex-row gap-6">
        <div className='ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[40%] h-full overflow-auto'>
        <List dense={false}>
          {items.length > 0 && items.map((data, index) => (
            <ListItem key={index} className='border-b'>
                <ListItemText className='flex' primary={data.nombre_capacitacion} />
                <div className='flex gap-2'>
                    <IconButton edge="end" title='Reproducir'
                        onClick={() => {
                        setSelectedItem(items[index])}
                        }>
                        <PlayCircleIcon/>
                    </IconButton>
                </div>
            </ListItem>
          ))}
        </List>
      </div>

      <div className='ccontainer-noblur w-[60%] h-full flex flex-col gap-4'>
        <div className='flex flex-row h-10'>
            <div className='text-xl m-auto'>{title}</div>
        </div>
        <div  className='defaultborders transparentdark flex flex-col gap-3 max-w-[800px] w-full aspect-video h-auto mx-auto'>
          {selectedVideo ?
           <video className='flex m-auto' src={selectedVideo} crossOrigin="anonymous" controls width="100%" height="100%"/>
           :
           <div className='flex flex-col m-auto'>
            <OndemandVideoIcon className='text-white flex m-auto w-32 h-32' style={{ width: "5rem", height: "5rem" }} />
            <div className=' text-white'>Seleccione un video</div>
           </div>
           }

        </div>
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
