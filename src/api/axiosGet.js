import axios from 'axios';

export async function axiosGet(
  logout,
  params,
  url,
  usuario = false,
  refresh = false
) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    const idUsuario = user.id_usuario;

    console.log('params: ', params);

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${url}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params: {...params}
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('Error 403: renovando token...');
      const logoutResponse = await logout();

      console.log('Que devuelve la funcion logout() ', error.response);

      if (logoutResponse === 200 && !refresh) {
        //repite la funcion ahora con el token renovado
        const response = await axiosGet(
          logout,
          params,
          url,
          usuario,
          (refresh = true)
        );
        return response;
      }
    }
    return { error: error };
  }
}
