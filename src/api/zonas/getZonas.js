import { axiosPost } from "../axiosPost";

export async function getZonas(logout, idTarea) {
    const response = await axiosPost(logout, 
        {
            "id_tarea":idTarea
        },
        "/ats/zonas", 
        false 
    )
    return response.formattedResult
}
