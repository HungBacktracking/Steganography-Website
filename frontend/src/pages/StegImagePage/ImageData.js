class ImageData {
  constructor(image) {
    this.name = image.name || "N/A";
    this.base64encode = image.base64encode || "";
    this.resolution = image.resolution || "N/A";
    this.format = image.format || "N/A";
    this.size = image.size || "N/A";
  }
}

export default ImageData;