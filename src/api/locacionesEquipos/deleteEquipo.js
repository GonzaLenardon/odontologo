import { axiosPost } from "../axiosPost"

export async function deleteEquipo(logout, id) {
    const response = await axiosPost(logout, 
        {                
            "id_equipo": id,
        },
        "/ats/borrarequipo", 
        true 
    )
    return response
}

