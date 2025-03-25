import { axiosPost } from "../axiosPost";

export async function getAdminGrid(logout, idTarea) {
  const response = await axiosPost(
    logout,
    { id_tarea: idTarea },
    "/ats/admingrid",
    true
  );
  console.log("response tareas", response);
  return response;
}
