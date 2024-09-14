"use strict";

import Snackbar from "./utils/snackbar.js";
import imagePreview from "./utils/imagePreview.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";
import config from "./utils/config.js";

// Selectors for image field, image preview, and image preview clear button
const $imageField = document.querySelector("[data-image-field]");
const $imagePreview = document.querySelector("[data-image-preview]");
const $imagePreviewClear = document.querySelector("[data-image-preview-clear]");

// Event listener for image field change to trigger image preview
$imageField.addEventListener("change", () => {
  imagePreview($imageField, $imagePreview);
});

if ($imageField.files.length) imagePreview($imageField, $imagePreview);

// Clear image preview by removing the "show" class from the preview container

const clearImagePreview = () => {
  $imagePreview.classList.remove("show");
  $imagePreview.innerHTML = "";
  $imageField.value = "";
};

$imagePreviewClear.addEventListener("click", clearImagePreview);

/**
 * Basic info update functionality
 */

const $basicInfoForm = document.querySelector("[data-basic-info-form]");
const $basicInfoSubmit = document.querySelector("[data-basic-info-submit]");

const oldFormData = new FormData($basicInfoForm);
const $progressBar = document.querySelector("[data-progress-bar]");

/**
 * Update basic information of the user profile.
 * @param {Event} event - The event object representing the form submission.
 */
const updateBasicInfo = async (event) => {
  // Prevent form submission
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
  $basicInfoSubmit.setAttribute("disabled", "");

  // Create a new FormData object to capture form data
  const formData = new FormData($basicInfoForm);

  // Handle case where selected image size is larger than 1MB
  if (formData.get("profilePhoto").size > config.profilePhoto.maxByteSize) {
    $basicInfoSubmit.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Profile photo size must be less than 1MB",
    });
    return;
  }

  // Handle case where user not selected any image for profile photo
  if (!formData.get("profilePhoto").size) {
    formData.delete("profilePhoto");
  }

  // Handle case when profilePhoto field exists
  if (formData.get("profilePhoto")) {
    // Overwrite profilePhoto value (which is type of 'file') to base64
    formData.set("profilePhoto", await imageAsDataURL($imageField.files[0]));
  }

  // Handle case where user did not change username
  if (formData.get("username") === oldFormData.get("username")) {
    formData.delete("username");
  }

  // Handle case where user did not change email
  if (formData.get("email") === oldFormData.get("email")) {
    formData.delete("email");
  }

  // Create request body from formData object
  const body = Object.fromEntries(formData.entries());

  // Show progress bar
  $progressBar.classList.add("loading");

  // Send a PUT request to update basic information
  const response = await fetch(`${window.location.href}/basic-info`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Handle case where response is successful
  if (response.ok) {
    // Enable submit button, show update message and reload window
    $basicInfoSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({ message: "Profile has been updated." });
    window.location.reload();
  }

  // Handle case where response status is 400 (Bad Request)
  if (response.status === 400) {
    // Enable submit button, show error message and hide progress bar
    $basicInfoSubmit.removeAttribute("disabled");
    $progressBar.classList.remove("loading");
    const { message } = await response.json();
    Snackbar({ type: "error", message });
  }
};

$basicInfoForm.addEventListener("submit", updateBasicInfo);

/**
 * Update password functionality
 */

const $passwordForm = document.querySelector("[data-password-form]");
const $passwordSubmit = document.querySelector("[data-password-submit]");

const updatePassword = async (event) => {
  // Prevent form submission
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
  $passwordSubmit.setAttribute("disabled", "");

  // Create a new FormData object to capture form data
  const formData = new FormData($passwordForm);

  // Handle case where password and confirm password do not match
  if (formData.get("password") !== formData.get("confirm_password")) {
    $passwordSubmit.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Please ensure your password and confirm password match.",
    });
    return;
  }

  // Create request body from formData object
  const body = Object.fromEntries(formData.entries());

  // Show progress bar
  $progressBar.classList.add("loading");

  // Send a PUT request to update password
  const response = await fetch(`${window.location.href}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Handle case where response is successful
  if (response.ok) {
    $passwordSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({ message: "Password has been updated." });
    return;
  }

  // Handle case where response status is 400 (Bad Request)
  if (response.status === 400) {
    $passwordSubmit.removeAttribute("disabled");
    $progressBar.classList.remove("loading");
    const { message } = await response.json();
    Snackbar({ type: "error", message });
  }
};

$passwordForm.addEventListener("submit", updatePassword);
