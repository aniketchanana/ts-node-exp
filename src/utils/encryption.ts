import config from "../../config";
import CryptoJS from "crypto-js";

export const encrypt = (plainText: string): string => {
  const encryptedText = CryptoJS.AES.encrypt(
    plainText,
    config.ENCRYPTION_PASSWORD
  );
  return encryptedText.toString();
};

export const decrypt = (encryptedText: string): string => {
  const decryptedBytes = CryptoJS.AES.decrypt(
    encryptedText,
    config.ENCRYPTION_PASSWORD
  );
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};

export const sha256Encryption = (password: string) => {
  return CryptoJS.SHA3(password).toString();
};
