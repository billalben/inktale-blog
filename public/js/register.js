"use strict";

import Snackbar from "./snackbar.js";

const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");

// Handling sign up form submission
$form.addEventListener("submit", async (event) => {
  // Prevent the default form submission
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
  $submitBtn.setAttribute("disabled", "");

  // Create a FormData object to capture form data
  const formData = new FormData($form);

  // Handling case where password and confirm password do not match
  if (formData.get("password") !== formData.get("confirm_password")) {
    // Enable the submit button and show error message
    $submitBtn.removeAttribute("disabled");

    // Show snackbar with error message
    Snackbar({
      type: "error",
      message:
        "Please ensure your password and confirm password contain the same value.",
    });
    return;
  }

  // Send account creation request to the server
  const response = await fetch(`${window.location.origin}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.fromEntries(formData.entries())
    ).toString(),
  });

  // Handle case where response status succeeds
  if (response.ok) {
    // Redirect user to the login page
    return (window.location = response.url);
  }

  // Handle case where response status is 400 (bad request)
  if (response.status === 400) {
    // Enable the submit button and show error message
    $submitBtn.removeAttribute("disabled");
    const { message } = await response.json();
    Snackbar({ type: "error", message });
  }
});
