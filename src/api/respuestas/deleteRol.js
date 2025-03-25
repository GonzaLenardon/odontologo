import { axiosPost } from '../axiosPost';

export async function deleteRol(logout, id_tarea, id_puesto) {
  const response = await axiosPost(
    logout,
    { id_tarea, id_puesto },
    '/ats/borrarpuestotarea',
    true
  );
  return response;
}
