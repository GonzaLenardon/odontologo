import { axiosGet } from "../axiosGet"

export async function getStreamingView(logout, fileName) {
    const response = await axiosGet(logout, 
        {},
        `/ats/streamingview/${fileName}`,
        true
    )
    return response
}