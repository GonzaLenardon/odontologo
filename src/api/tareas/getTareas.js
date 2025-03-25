import { axiosPost } from '../axiosPost';

export async function getTareas(logout) {
  const response = await axiosPost(
    logout,
    { deshabilitadas: 1 },
    '/ats/tareas',
    true
  );
  console.log('response tareas', response);
  return response;
}
