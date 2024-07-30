import axios from "axios";

export const http =  axios.create({
    baseURL: "https://steganography-website-backend.onrender.com/",
    // baseURL: "http://127.0.0.1:5001",
    headers: {
        "Content-type": "application/json"
    }
});



export default http;