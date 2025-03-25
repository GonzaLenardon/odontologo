import { axiosPost } from "../axiosPost"

export async function postPuesto(logout, data) {
    const response = await axiosPost(logout, 
        {                
            nombre_puesto: data.nombre_puesto
        },
        "/ats/crearpuesto",  
        true
    )
    return response
}