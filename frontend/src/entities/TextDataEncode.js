import { DataEncode } from ".";
import { textToBinary } from '../utils/endec';

class TextDataEncode extends DataEncode {
  constructor(text, password) {
    // text     => binary (UTF-8) => binaryMessage
    // password => binary (UTF-8) => key
    super(textToBinary(text), textToBinary(password)); 
  }
}

export default TextDataEncode;