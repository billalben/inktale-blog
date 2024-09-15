"use strict";

import Snackbar from "./utils/snackbar.js";
import imagePreview from "./utils/imagePreview.js";
import config from "./utils/config.js";

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
 * Handle blog update
 */
const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");
const $progressBar = document.querySelector("[data-progress-bar]");

const handleBlogUpdate = async (event) => {
  // Prevent form submission
  event.preventDefault();

  // Disable the update button to prevent multiple submissions
  $submitBtn.setAttribute("disabled", "");

  // Create a new FormData object to capture form data
  const formData = new FormData($form);

  // Handle case where user not selected any image for banner when creating blog.
  if (!formData.get("banner").size && !$imagePreview.hasChildNodes()) {
    // Enable the update button and show error message
    $submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Please select an image for the blog banner.",
    });
    return;
  }

  // Handle case where selected image for banner is larger than 3MB
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    // Enable the publish button and show error message
    $submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Image should be less than 3 MB in size.",
    });
    return;
  }

  // Handle case when user don't update the blog banner
  if (!formData.get("banner").size && $imagePreview.hasChildNodes()) {
    formData.delete("banner");
  }

  // Show progress bar
  $progressBar.classList.add("loading");

  // Sending form data to the server to update a blog
  const response = await fetch(window.location.href, {
    method: "PUT",
    body: formData,
  });

  // Handle case where response is successful
  if (response.ok) {
    $submitBtn.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({ message: "Blog updated successfully." });

    window.location = window.location.href.replace("/edit", "");
    return;
  }

  // Handle case where response is unsuccessful
  if ((response.status === 400)) {
    // Enable published button and show error message
    $submitBtn.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");

    const { message } = await response.json();
    Snackbar({ type: "error", message });
  }
};

$form.addEventListener("submit", handleBlogUpdate);
