import { axiosPost } from "../axiosPost"

export async function getStreamings(logout) {
    const response = await axiosPost(logout, 
        {},
        "/ats/streamings", 
        true
    )
    return response
}