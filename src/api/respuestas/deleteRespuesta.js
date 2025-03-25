import { axiosPost } from "../axiosPost";

export async function deleteRespuesta(logout, id) {
  console.log("que id llega ", id);
  const response = await axiosPost(
    logout,
    {
      id_respuesta: id,
    },
    "/ats/borrarrespuesta",
    true
  );
  return response;
}
