import http from "./http_common";

const embeddMessage = async (base64Data, message) => {
  // Dummy sample code
  let data = {
    audio: base64Data,
    message: message
  };

  // console.log("data: ", data);
  try{
    let response = await http.post("/audio/encoded", data);
    // console.log("response: ", response.data);
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
    image: base64Data
  };
  try{
    let response = await http.post("/audio/decoded", data);
    return response.data;
  }
  catch(e){
    console.log(e);
    return null;
  }
}

const AudioService = {
  embeddMessage,
  decodeMessage
};

export default AudioService;