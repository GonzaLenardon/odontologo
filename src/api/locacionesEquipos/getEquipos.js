import { axiosPost } from "../axiosPost"

export async function getEquipos(logout,) {
    const response = await axiosPost(logout, 
        {                
        },
        "/ats/ubicaciones", 
        false 
    )
    console.log("response equipos", response.formattedResult) 
    return response.formattedResult
}