"use strict";

import imagePreview from "./utils/imagePreview.js";
import Snackbar from "./utils/snackbar.js";
import config from "./utils/config.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";

// Selectors for image field, button image preview, and clear preview
const $imageField = document.querySelector("[data-image-field]");
const $imagePreview = document.querySelector("[data-image-preview]");
const $imagePreviewClear = document.querySelector("[data-image-preview-clear]");

// Event listener for image field change to trigger image preview
$imageField.addEventListener("change", function () {
  imagePreview($imageField, $imagePreview);
});

if ($imageField.files.length) imagePreview($imageField, $imagePreview);

// Event listener for clear image preview button
const clearImagePreview = () => {
  $imagePreview.classList.remove("show");
  $imagePreview.innerHTML = "";
  $imageField.value = "";
};

$imagePreviewClear.addEventListener("click", clearImagePreview);

/**
 * Handle blog publish
 */
const $form = document.querySelector("[data-form]");
const $publishBtn = document.querySelector("[data-publish-btn]");

const handlePublishBlog = async function (event) {
  // Prevent form submission
  event.preventDefault();

  // Disable the publish button to prevent multiple submissions
  $publishBtn.setAttribute("disabled", "");

  // Create a new FormData object to capture form data
  const formData = new FormData($form);

  // Handle case where user not selected any image for banner when creating blog.
  if (!formData.get("banner").size) {
    // Enable the publish button and show error message
    $publishBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Please select an image for the blog banner.",
    });
    return;
  }

  // Handle case where selected image for banner is larger than 3MB
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    // Enable the publish button and show error message
    $publishBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Image should be less than 3 MB in size.",
    });
    return;
  }

  // Overwrite banner value (which is type of 'File') to base64
  formData.set("banner", await imageAsDataURL(formData.get("banner")));

  // Create a request body from formData
  const body = Object.fromEntries(formData.entries());

  // Sending form data to the server to create a new blog
  const response = await fetch(`${window.location.origin}/create-blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

$form.addEventListener("submit", handlePublishBlog);
