import http from "./http_common";

const embeddMessage = async (base64Data, message) => {
  // Dummy sample code
  let data = {
    video: base64Data,
    message: message
  };
  try{
    let response = await http.post("/video/encoded", data);
    return response.data;
  }
  catch(e){
    console.log(e);
    return null;
  }
}



const decodeMessage = async (base64Data) => {
  // Dummy sample code
  let data = {
    video: base64Data
  };
  try{
    let response = await http.post("/video/decoded", data);
    return response.data;
  }
  catch(e){
    console.log(e);
    return null;
  }
}

const VideoServices = {
  embeddMessage,
  decodeMessage
};

export default VideoServices;