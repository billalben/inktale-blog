"use strict";

/**
 * Converts a given image blob into a data URL.
 * @param {Blob} imageBlob - The Blob object to represent the image.
 * @returns {Promise<string>} - A promise that resolves with the data URL of the image.
 */

const imageAsDataURL = async (imageBlob) => {
  const fileReader = new FileReader();

  fileReader.readAsDataURL(imageBlob);

  return new Promise((resolve, reject) => {
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });

    fileReader.addEventListener("error", () => {
      reject(fileReader.error);
    });
  });
};

export default imageAsDataURL;
