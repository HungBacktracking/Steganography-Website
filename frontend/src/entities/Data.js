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

class Data {
  constructor(data) {
    this.data = data;
    this.base64encode = null;
  }

  encodeToBase64() {
    console.log("Encode at Subclass Data");
  }

  encrypt(password) {
  }

  decrypt(password) {
  }
}

export default Data;