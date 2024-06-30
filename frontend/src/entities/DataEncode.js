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
  }

  static fromCipherText(cipherText, binaryKey) {
    let data = new DataEncode(null, binaryKey);
    data.cipherText = cipherText;
  }

  // Return: base64
  encrypt() {
    this.cipherText = encryptAES(this.binaryMessage, this.binaryKey);
    return this.cipherText;
  }

  decrypt() {
    this.binaryMessage = decryptAES(this.cipherText, this.binaryKey);
    return this.binaryMessage;
  }
}

export default DataEncode;