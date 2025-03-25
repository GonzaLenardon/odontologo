
import { axiosPost } from "../axiosPost"

export async function postPregunta(logout, data) {
    const response = await axiosPost(logout, 
        {
            ...data
        },
        "/ats/crearpregunta", 
        true 
    )
    return response
}