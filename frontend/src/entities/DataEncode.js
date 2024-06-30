/**
 * Data class is a superclass for all data classes.
 * 
 * Flow: 
 * - Data => Encode to Base64 => Encrypt  => Gửi Server to Embed.
 * - Server Response =>  Extract => Decrypt => Decode Base64 => Data
 * 
 * Default: 
 * - Encrypt: AES
 * - Library: CryptoJS
*/

import { textToBinary, binaryToTextUTF8, encryptAES, decryptAES } from "../utils/endec";

class DataEncode {
  constructor(binaryMessage, binaryKey) {
    this.binaryMessage = binaryMessage;
    this.binaryKey = binaryKey;
    this.cipherText = null;

    console.log("DataEncode constructor");
    console.log(this.binaryMessage);
    console.log(this.binaryKey);
  }

  // Return: base64
  encrypt() {
    this.cipherText = encryptAES(this.binaryMessage, this.binaryKey);
    console.log("cipherText: ", this.cipherText);
    return this.cipherText;
  }

  decrypt() {
    let binaryMessage = decryptAES(this.cipherText, this.binaryKey);
    console.log("binaryMessage: ", binaryMessage);
    return binaryMessage;
  }
}

export default DataEncode;