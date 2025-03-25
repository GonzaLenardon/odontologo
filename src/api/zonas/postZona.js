import { axiosPost } from "../axiosPost"


export async function postZona(logout, data) {
    const response = await axiosPost(logout, 
        {
            id_tarea: data.id_tarea, 
            nombre_zona: data.nombre_zona
        },
        "/ats/crearzona", 
        true 
    )
    return response
}