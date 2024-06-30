import CryptoJS from "crypto-js";
import assert from "assert";

// using CryptoJS to encode with UTF-8 => return binaryString
export function textToBinary(text) {
 //text => binary String 
 return CryptoJS.enc.Utf8.parse(text).toString(CryptoJS.enc.Base64);
  return CryptoJS.enc.Utf8.parse(text).toString();
}


export function binaryToTextUTF8(binaryString) {
  // binaryString = binary.toString();
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(binaryString));
}

export function encryptAES(binaryMessage, binaryKey) {
  return CryptoJS.AES.encrypt(binaryMessage, binaryKey).toString();
}

export function decryptAES(ciphertext, binaryKey) {
  return CryptoJS.AES.decrypt(ciphertext, binaryKey).toString(CryptoJS.enc.Base64);
}

function testUTF8() {
  let text = "Cao Quảng Phát";
  let binary = textToBinary(text);
  let text2 = binaryToTextUTF8(binary);
  console.log("Plaintext    : ", text);
  console.log("Binary Encode: ", binary);
  console.log("Text Decode  : ", text2);
  assert.strictEqual(text, text2);
}

function testAES() {
  let text = "Hello World";
  let key = "1234567890";
  try{
    let binaryText = textToBinary(text);
    let binaryKey = textToBinary(key);
    let ciphertext = encryptAES(binaryText, binaryKey);
    // let ciphertext = encryptAES(text, key);
    console.log("ciphertext: ", ciphertext);

    let decryptBinaryText = decryptAES(ciphertext, binaryKey);
    console.log("decryptBinaryText: ", decryptBinaryText);
    let decryptText = binaryToTextUTF8(decryptBinaryText);
    console.log("decryptText: ", decryptText);
    // assert.strictEqual(text, decryptText);
    
  }catch(e){
    console.log(e);
  }
}
testUTF8();
testAES();
