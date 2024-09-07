"use strict";

import dialog from "./utils/dialog.js";

// Select the reaction button element and reaction number
const $reactionBtn = document.querySelector("[data-reaction-btn]");
const $reactionNumber = document.querySelector("[data-reaction-number]");

/**
 * Add a reaction to the current blog.
 * This function sends a PUT request to the reactions endpoint to add a reaction.
 * If the response is successful (status code 200), it activates the reaction button
 * and increases the reaction count displayed on the page.
 * If the response status is 401 (Unauthorized), it prompts the user to log in.
 *
 * @function addReaction
 * @throws {Error} If there is an error during the process, it will be logged.
 */
const addReaction = async () => {
  try {
    // Send a PUT request to the reactions endpoint
    const response = await fetch(`${window.location}/reactions`, {
      method: "PUT",
    });

    // Handle case where response is successful
    if (response.ok) {
      // Active the reaction button and increase the reaction count
      $reactionBtn.classList.add("active", "reaction-anim-add");
      $reactionBtn.classList.remove("reaction-anim-remove");
      $reactionNumber.textContent = Number($reactionNumber.textContent) + 1;
    }

    // Handle case where user is not authenticated (status code 401)
    if (response.status === 401) {
      const $dialog = dialog({
        title: "Login to continue",
        content: `We're a place where coders share, stay up-to-date and grow their careers.`,
      });

      document.body.appendChild($dialog);
    }
  } catch (error) {
    console.error("Error adding reaction", error.message);
  }
};

/**
 * Remove a reaction from the current blog.
 * Sends a DELETE request to the reactions endpoint.
 * Updates UI accordingly based on server response.
 *
 * @function removeReaction
 * @throws {Error} If there is an error during the process, it will be logged.
 */
const removeReaction = async () => {
  try {
    // Send a DELETE request to the reactions endpoint
    const response = await fetch(`${window.location}/reactions`, {
      method: "DELETE",
    });

    // Handle case where response is successful
    if (response.ok) {
      // Deactivate the reaction button and decrease the reaction count
      $reactionBtn.classList.add("reaction-anim-remove");
      $reactionBtn.classList.remove("active", "reaction-anim-add");
      $reactionNumber.textContent = Number($reactionNumber.textContent) - 1;
    }

    // Handle case where user is not authenticated (status code 401)
    if (response.status === 401) {
      const $dialog = dialog({
        title: "Login to continue",
        content: `We're a place where coders share, stay up-to-date and grow their careers.`,
      });

      document.body.appendChild($dialog);
    }
  } catch (error) {
    console.error("Error removing reaction", error.message);
    throw error;
  }
};

// Add a click event listener to the reaction button
$reactionBtn.addEventListener("click", async () => {
  $reactionBtn.setAttribute("disabled", "");

  if ($reactionBtn.classList.contains("active")) {
    await removeReaction();
  } else {
    await addReaction();
  }

  $reactionBtn.removeAttribute("disabled");
});
