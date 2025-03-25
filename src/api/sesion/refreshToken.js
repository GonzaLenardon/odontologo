import axios from 'axios';

export async function refreshToken() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const refreshToken = user ? user.refreshToken : null;

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/token`,
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('RefreshResponse', response.status, response.data);

    return {
      refreshCode: response.status,
      accessToken: response.data.accessToken,
      refreshTok: response.data.refreshToken,
    };
  } catch (error) {
    return { refreshCode: error.response.status, accessToken: '' };
  }
}
