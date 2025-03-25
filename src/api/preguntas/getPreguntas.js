import { axiosPost } from "../axiosPost"

export async function getPreguntas(logout, idTarea) {
    console.log("idtatatarea", idTarea)
    const response = await axiosPost(logout, 
        {
            ...(idTarea && { "id_tarea": idTarea })
        },
        "/ats/getpreguntas", 
        false 
    )
    return response
}