export default class EncodeFile {
    static MAX_SIZE_IN_BYTE = 1024 * 1024; // 1 MB
  
    constructor(file) {
      this.name = file.name;
      this.size = file.size;
      this.content = file.content;
    }
  
    static _checkFileType(file) {
      if (file.type !== 'text/plain') {
        return "Invalid file type. Please upload a text file.";
      }
      return null;
    }
  
    static _checkFileSize(file) {
      if (EncodeFile.MAX_SIZE_IN_BYTE > 0 && file.size > EncodeFile.MAX_SIZE_IN_BYTE) {
        return "File size exceeds the limit. Please upload a smaller file.";
      }
      return null;
    }
  
    static checkFileError(file) {
      let checkError = EncodeFile._checkFileType(file)
        || EncodeFile._checkFileSize(file);
  
      return checkError;
    }
  
    static async readFile(file) {
      // Read the file
      try {
        // Read path of file and save to fileInfo
        const reader = new FileReader();
  
        // Await to read the file and get the content
        const content = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            // console.log("File content: ", e.target.result);
            resolve(e.target.result);
          }
          reader.onerror = (e) => {
            reject(e);
          }
          reader.readAsText(file);
        });
  
        file.content = content;
        return {
          data: new EncodeFile(file),
          error: null,
        }
      } catch (err) {
        // console.log("Error: ", err);
        return {
          data: null,
          error: "Failed to read the file. Please try again.",
        }
      }
    }
  }