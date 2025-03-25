import { axiosPost } from '../axiosPost';

export const getUser = async (logout) => {
  const response = await axiosPost(logout, {}, '/users/getallusers');
  console.log('Userss', response);

  return response;
};
