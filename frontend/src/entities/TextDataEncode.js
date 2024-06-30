import { DataEncode } from ".";
import { textToBinary, binaryToTextUTF8 } from '../utils/endec';

class TextDataEncode extends DataEncode {
  constructor(text, password) {
    // text     => binary (UTF-8) => binaryMessage
    // password => binary (UTF-8) => key
    super(textToBinary(text), textToBinary(password)); 
  }

  encrypt() {
    return super.encrypt();
  }

  decrypt() {
    return binaryToTextUTF8(super.decrypt());
  }
}

export default TextDataEncode;