import { axiosPost } from "../axiosPost"

export async function updatePuesto(logout, data) {
    const response = await axiosPost(logout, 
        {                
            id_puesto: data.id_puesto, 
            nombre_puesto : data.nombre_puesto
        },
        "/ats/actualizarpuesto",  
        true
    )
    return response
}