import { axiosPost } from "../axiosPost"

export async function deletePuesto(logout, id) {
    const response = await axiosPost(logout, 
        {                
            "id_puesto": id,
        },
        "/ats/borrarpuesto",  
        true
    )
    return response
}

