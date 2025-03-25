import { axiosPost } from "../axiosPost"

export async function postEquipo(logout, data) {
    const response = await axiosPost(logout, 
        {                
            nombre_equipo: data.nombre_equipo, 
            email_equipo: data.email_equipo        
        },
        "/ats/crearequipo", 
        true 
    )
    return response
}
