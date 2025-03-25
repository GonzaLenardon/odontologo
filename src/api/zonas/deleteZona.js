import { axiosPost } from "../axiosPost"

export async function deleteZona(logout, idZona) {
    const response = await axiosPost(logout, 
        {
            "id_zona": idZona,
        },
        "/ats/borrarzona", 
        true 
    )
    return response
}
