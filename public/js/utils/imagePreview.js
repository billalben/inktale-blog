"use strict";

/**
 * Generate an image preview from the selected file and display it in a specified container.
 * @param {HTMLInputElement} $imageField - The image field input element.
 * @param {HTMLImageElement} $imagePreview - The image preview container.
 * @returns {Promise<void>} - A promise that resolves when the image preview is generated.
 */

const imagePreview = async ($imageField, $imagePreview) => {
  const imageObjectUrl = URL.createObjectURL($imageField.files[0]);
  const $image = document.createElement("img");
  $image.classList.add("img-cover");
  $image.src = imageObjectUrl;

  $imagePreview.appendChild($image);
  $imagePreview.classList.add("show");

  return imageObjectUrl;
};

export default imagePreview;
