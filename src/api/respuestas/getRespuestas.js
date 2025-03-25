import { axiosPost } from "../axiosPost"

export async function getRespuestas(logout, idPregunta) {
    const response = await axiosPost(logout, 
        {                
            ...(idPregunta && {id_pregunta: idPregunta})
        },
        "/ats/getrespuestas", 
        true 
    )
    return response
}