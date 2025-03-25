import axios from 'axios';

export async function axiosPost(
  logout,
  body,
  url,
  usuario = false,
  type,
  refresh = false
) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    const idUsuario = user.id_usuario;

    console.log('body: ', body);

    if (!token) {
      throw new Error('No token found');
    }

    // Si es de tipo formdata se pasa el body directamente
    const data =
      body instanceof FormData
        ? body
        : {
            ...body,
            ...(usuario && { id_usuario: idUsuario }),
          };

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}${url}`,
      data,
      {
        headers: {
          //...(type ? {"Content-Type": type} : {"Content-Type": "application/json"}),
          Authorization: `${token}`,
        },
      }
    );

    //console.log("response!", response.data);4

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('Error 403: renovando token...');
      const logoutResponse = await logout();

      console.log('Que devuelve la funcion logout() ', error.response);

      if (logoutResponse === 200 && !refresh) {
        //repite la funcion ahora con el token renovado
        const response = await axiosPost(
          logout,
          body,
          url,
          usuario,
          type,
          (refresh = true)
        );
        console.log(response);
        return response;
      }
    }
    return { error: error };
  }
}
