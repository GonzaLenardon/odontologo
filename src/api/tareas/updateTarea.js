import { axiosPost } from '../axiosPost';

export async function updateTarea(
  logout,
  id_usuario,
  nombre_tarea,
  url_video,
  id_tarea,
  porcentaje_aprobacion,
  md5_video,
  estado_tarea
) {
  const response = await axiosPost(
    logout,
    {
      id_usuario,
      nombre_tarea,
      url_video,
      id_tarea,
      porcentaje_aprobacion,
      md5_video,
      estado_tarea,
    },
    '/ats/actualizartarea',
    true
  );
  return response;
}
