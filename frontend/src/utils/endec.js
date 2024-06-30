import CryptoJS from "crypto-js";
// import assert from "assert";

// using CryptoJS to encode with UTF-8 => return binaryString
export function textToBinary(text) {
 //text => binary String 
 if (text === null) return "";
 return CryptoJS.enc.Utf8.parse(text).toString(CryptoJS.enc.Base64);
  return CryptoJS.enc.Utf8.parse(text).toString();
}


export function binaryToTextUTF8(binaryString) {
  // binaryString = binary.toString();
  if (binaryString === null) return "";
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(binaryString));
}

export function encryptAES(binaryMessage, binaryKey) {
  return CryptoJS.AES.encrypt(binaryMessage, binaryKey).toString();
}

export function decryptAES(ciphertext, binaryKey) {
  return CryptoJS.AES.decrypt(ciphertext, binaryKey).toString(CryptoJS.enc.Utf8);
}

function testUTF8() {
  console.log("-- Test UTF-8 ---");
  let text = "Cao Quảng Phát";
  let binary = textToBinary(text);
  let text2 = binaryToTextUTF8(binary);
  console.log("Plaintext    : ", text);
  console.log("Binary Encode: ", binary);
  console.log("Text Decode  : ", text2);
  // assert.strictEqual(text, text2);
  if (text !== text2) {
    console.log("Test UTF-8 Fail")
    return;
  }
  console.log("Test UTF-8 Success")
}

function testAES() {
  console.log("-- Test AES ---");
  let text = "Cao Quảng Phát";
  let key = "";
  try{
    let binaryText = textToBinary(text);
    console.log("binaryText: ", binaryText);
    let binaryKey = textToBinary(key);
    let ciphertext = encryptAES(binaryText, binaryKey);
    // let ciphertext = encryptAES(text, key);
    console.log("ciphertext: ", ciphertext);

    let decryptBinaryText = decryptAES(ciphertext, binaryKey);
    console.log("decryptBinaryText: ", decryptBinaryText);
    let decryptText = binaryToTextUTF8(decryptBinaryText);
    console.log("decryptText: ", decryptText);

    if (text !== decryptText) {
      console.log("Test AES Fail")
      return;
    }
    console.log("Test AES Success")
  }catch(e){
    console.log(e);
  }
}
// testUTF8();
// testAES();
