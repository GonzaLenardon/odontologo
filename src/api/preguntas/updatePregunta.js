
import { axiosPost } from "../axiosPost"

export async function updatePregunta(logout, data) {
    const response = await axiosPost(logout, 
        {
            ...data
        },
        "/ats/actualizarpregunta", 
        true 
    )
    return response
}