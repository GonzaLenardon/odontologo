import axios from 'axios';

export async function login(username, password, system_id, captchaToken) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/login`,
      { username, password, system_id, captchaToken }
    );
    return response.data;
  } catch (error) {
    // Lanza el error para que sea capturado en handleSubmit
    throw error.response ? error.response : new Error(error.message);
  }
}
