import { Data } from ".";

class TextData extends Data {
  constructor(text) {
    super(text);
    this.encodeToBase64();
  }

  encodeToBase64() {
    console.log("Encode at TextData");
    this.base64encode = "base64encode";
  }
}

export default TextData;