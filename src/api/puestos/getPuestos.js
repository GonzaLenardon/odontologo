import { axiosPost } from "../axiosPost"

export async function getPuestos(logout, ) {
    const response = await axiosPost(logout, 
        {                
        },
        "/ats/getpuestos",  
    )
    console.log("response puestos", response) 

    return response
}