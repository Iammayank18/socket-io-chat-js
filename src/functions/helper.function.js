import encode from "jwt-encode";
import { jwtDecode } from "jwt-decode";
import { AppwriteException } from "appwrite";

export function isValidURL(url) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

export const encryptPassword = (password) => {
  const secret = "JDKNSOoaidjfnosada12312";
  const data = {
    password: password,
  };
  return encode(data, secret);
};

export const decryptPassword = (password) => {
  return jwtDecode(password);
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const base64ToFile = (base64Data) => {
  const fileName = new Date().toLocaleTimeString();
  const by = atob(base64Data.split(",")[1]);
  const mi = base64Data.split(",")[0].split(":")[1].split(";")[0];

  const arrayBuffer = new ArrayBuffer(by.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < by.length; i++) {
    uint8Array[i] = by.charCodeAt(i);
  }

  const file = new File([uint8Array], `${fileName}.png`, {
    type: mi,
  });
  return file;
};

export const createImageFromBase64 = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

export const getErrorMessage = (error) => {
  if (error.response) {
    return error.resolve.message.replace("AppwriteException:", "");
  }
  if (error.message) {
    return error.message.replace("AppwriteException:", "");
  }
  if (error.data) {
    return error.data.message.replace("AppwriteException:", "");
  }
};
