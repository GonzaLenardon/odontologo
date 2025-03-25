import { axiosPost } from "../axiosPost"

export async function deleteTarea(logout, idTarea) {
    const response = await axiosPost(logout, 
        {
            "id_tarea": idTarea        
        },
        "/ats/borrartarea", 
        true 
    )
    return response
}