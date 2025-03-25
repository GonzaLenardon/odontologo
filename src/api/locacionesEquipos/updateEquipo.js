import { axiosPost } from "../axiosPost"

export async function updateEquipo(logout, data) {
    const response = await axiosPost(logout, 
        {                
            id_equipo: data.id_equipo, 
            nombre_equipo: data.nombre_equipo,
            email_equipo : data.email_equipo       
        },
        "/ats/actualizarequipo", 
        true 
    )
    return response
}