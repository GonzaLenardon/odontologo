import { axiosPost } from "../axiosPost";

export async function updateRespuesta(logout, data) {
  console.log("dadafadds ... ", data);
  const response = await axiosPost(
    logout,
    {
      ...data,
    },
    "/ats/actualizarrespuesta",
    true
  );
  return response;
}
