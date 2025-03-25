import { axiosPost } from "../axiosPost"

export async function deletePregunta(logout, id) {
    const response = await axiosPost(logout, 
        {
            "id_pregunta": id
        },
        "/ats/borrarpregunta", 
        true 
    )
    return response
}