import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { getPreguntas } from "../../api/preguntas/getPreguntas";
import { postPregunta } from "../../api/preguntas/postPregunta";
import { updatePregunta } from "../../api/preguntas/updatePregunta";
import { deletePregunta } from "../../api/preguntas/deletePregunta";
import { getTareas } from "../../api/tareas/getTareas";
import { useUserContext } from "../../context/UserContext";
import Loader from "../elements/Loader";
import CSnackbar from "../elements/CSnackbar";
import YesNoDialog from "../dialogs/YesNoDialog";

export default function Preguntas() {
  const { logout } = useUserContext();
  const [loading, setLoading] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const snackbarError = () => {
    setSnackbar({
      open: true,
      severity: "error",
      message: "Se produjo un error",
    });
  };
  const snackbarPost = () => {
    setSnackbar({
      open: true,
      severity: "success",
      message: "Elemento agregado exitosamente",
    });
  };
  const snackbarDelete = () => {
    setSnackbar({
      open: true,
      severity: "success",
      message: "Elemento eliminado exitosamente",
    });
  };
  const snackbarUpdate = () => {
    setSnackbar({
      open: true,
      severity: "success",
      message: "Elemento actualizado exitosamente",
    });
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState({ title: "", description: "" });

  const [mode, setMode] = useState("post");
  const [formTitle, setFormTitle] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedTarea, setSelectedTarea] = useState("");

  const [items, setItems] = useState([]);
  const [tareas, setTareas] = useState([]);

  const createTitle = "Crear Nueva Pregunta";
  const editTitle = "Editar Pregunta";

  const defaultData = {
    id_pregunta: -1,
    pregunta: "",
    id_tarea: "",
    columna: 1,
  };

  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    fetchTareas();
  }, []);

  useEffect(() => {
    updateFormData("id_tarea", selectedTarea);
    selectedTarea && fetchData();
    setMode("post");
  }, [selectedTarea]);

  useEffect(() => {
    switch (mode) {
      case "post":
        setFormTitle(createTitle);
        setFormData(defaultData);
        break;
      case "update":
        setFormTitle(editTitle);
        setFormData({
          id_pregunta: items[selectedItem].id_pregunta,
          id_tarea: items[selectedItem].id_tarea,
          columna: items[selectedItem].numero_columna,
          pregunta: items[selectedItem].nombre_pregunta,
        });
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

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const tareasresponse = await getTareas(logout);
      setTareas(tareasresponse);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDialog = async (id) => {
    setOpenDialog(true);
    setDialog({
      title: "Eliminar Elemento",
      description: "Desea eliminar?",
      action: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deletePregunta(logout, id);
      snackbarDelete();
      fetchData();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      var response;

      if (mode === "post") {
        response = await postPregunta(logout, formData);
        snackbarPost();
      }
      if (mode === "update") {
        response = await updatePregunta(logout, formData);
        snackbarUpdate();
      }
      console.log("submit response", response);
      setMode("post");
      updateFormData("pregunta", "");
      updateFormData("id_tarea", selectedTarea);
      fetchData();
    } catch (error) {
      console.log(error);
      snackbarError();
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: newValue,
    }));
  };

  return (
    <div className="w-full h-full flex flex-row gap-6">
      <div className="ccontainer-noblur flex flex-col gap-2 m-auto ml-0 w-[50%] h-full overflow-auto">
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
                <ListItemText
                  className="flex"
                  primary={
                    data.nombre_pregunta + " (" + data.numero_columna + ")"
                  }
                />
                <div className="flex gap-2">
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteDialog(data.id_pregunta)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setMode("update");
                      setSelectedItem(index);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </ListItem>
            ))}
        </List>
      </div>

      <div className="ccontainer-noblur w-[50%] h-full flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="text-xl m-auto"> {formTitle}</div>
          {mode === "update" && (
            <IconButton
              className="text-xl m-auto"
              onClick={() => setMode("post")}
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
            label="Pregunta"
            fullWidth
            size="small"
            value={formData.pregunta}
            onChange={(e) => updateFormData("pregunta", e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="select-label">Columna</InputLabel>
            <Select
              labelId="select-label"
              label="Columna"
              value={formData.columna}
              onChange={(e) => updateFormData("columna", e.target.value)}
            >
              <MenuItem value={1}>
                Visualizar en columna de Peligros (1)
              </MenuItem>
              <MenuItem value={2}>
                Visualizar en columna de Barreras (2)
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: "auto",
              height: "50px",
              backgroundColor: " rgb(71 85 105)",
            }}
          >
            {" "}
            Aceptar{" "}
          </Button>
        </form>
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
