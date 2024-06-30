import { DataEncode } from ".";

class TextDataEncode extends DataEncode {
  constructor(text) {
    super(text);
    this.encodeToBase64();
  }

  encodeToBase64() {
    console.log("Encode at TextData");
    this.base64encode = "base64encode";
  }
}

export default TextDataEncode;