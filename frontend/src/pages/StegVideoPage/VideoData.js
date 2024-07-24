class VideoData {
    constructor(video) {
      this.name = video.name || "N/A";
      this.base64encode = video.base64encode || "";
      this.format = video.format || "N/A";
      this.size = video.size || "N/A";    
    }
  }
  
export default VideoData;