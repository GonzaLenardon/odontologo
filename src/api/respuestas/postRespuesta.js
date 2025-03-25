import { axiosPost } from "../axiosPost"

export async function postRespuesta(logout, data) {
    const response = await axiosPost(logout, 
        {                
            ...data
        },
        "/ats/crearrespuesta", 
        true 
    )
    return response
}