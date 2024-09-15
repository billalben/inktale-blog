"use strict";

import imagePreview from "./utils/imagePreview.js";
import Snackbar from "./utils/snackbar.js";
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
 * Handle blog publish
 */
const $form = document.querySelector("[data-form]");
const $publishBtn = document.querySelector("[data-publish-btn]");
const $progressBar = document.querySelector("[data-progress-bar]");

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

  // Show progress bar
  $progressBar.classList.add("loading");

  // Sending form data to the server to create a new blog
  const response = await fetch(`${window.location.origin}/create-blog`, {
    method: "POST",
    body: formData,
  });

  // Handle case where response is successful
  if (response.ok) {
    Snackbar({ message: "Blog created successfully." });
    $progressBar.classList.add("loading-end");

    // Redirect to the newly created blog post page
    return (window.location = response.url);
  }

  // Handle case where response is unsuccessful
  if (response.status === 400) {
    // Enable published button and show error message
    $publishBtn.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");

    const { message } = await response.json();

    Snackbar({ type: "error", message });
  }
};

$form.addEventListener("submit", handlePublishBlog);
