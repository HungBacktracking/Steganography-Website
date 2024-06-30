import http from "./http_common";

const embeddMessage = async (base64Data, message) => {
  // Dummy sample code
  let data = {
    image: base64Data,
    message: message
  };
  try{
    let response = await http.post("/image/encoded", data);
    return response.data;
  }
  catch(e){
    console.log(e);
    return null;
  }
}

const ImageServices = {
  embeddMessage
};

export default ImageServices;