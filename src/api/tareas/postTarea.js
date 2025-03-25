import { axiosPost } from '../axiosPost';

export async function postTarea(logout, data, md5_video) {
  const response = await axiosPost(
    logout,
    {
      nombre_tarea: data.nombre_tarea,
      url_video: data.url_video,
      porcentaje_aprobacion: data.porcentaje_aprobacion,
      md5_video: md5_video,
      estado_tarea: data.estado_tarea,
    },
    '/ats/creartarea',
    true
  );
  return response;
}
