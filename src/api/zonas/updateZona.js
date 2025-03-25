import { axiosPost } from "../axiosPost"

export async function updateZona(logout, data) {
    const response = await axiosPost(logout, 
        {
            id_zona: data.id_zona, 
            nombre_zona: data.nombre_zona
        },
        "/ats/actualizarzona", 
        true 
    )
    return response
}
