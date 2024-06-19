import http from "../http-common";

const embeddMessage = (base64Data, message) => {
  // Dummy sample code
  let data = {
    base64Data: base64Data,
    message: message
  };
  return http.post("/embedd", data);
}

const ImageServices = {
  embeddMessage
};

export default ImageServices;