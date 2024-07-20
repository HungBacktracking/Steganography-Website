import axios from "axios";

export const http =  axios.create({
    baseURL: "https://steganography-website-backend.onrender.com/",
    headers: {
        "Content-type": "application/json"
    }
});



export default http;