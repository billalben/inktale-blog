"use strict";

// Select the reading list button element and reading list number.
const $readingListBtn = document.querySelector("[data-reading-list-btn]");
const $readingListNumber = document.querySelector("[data-reading-list-number]");

/**
 * Add the current blog to the user's reading list.
 *
 */
const addToReadingList = async () => {
  try {
    // Send a PUT request to the readingList endpoint
    const response = await fetch(`${window.location}/reading-list`, {
      method: "PUT",
    });

    // Handle case where response is successful
    if (response.ok) {
      // Active the reading list button and increase the reading list count
      $readingListBtn.classList.add("active");
      $readingListNumber.textContent =
        Number($readingListNumber.textContent) + 1;
    }

    // Handle case where user is not authenticated (status code 401)
    if (response.status === 401) {
      console.log("need to login");
    }
  } catch (error) {
    console.error("Error adding reading", error.message);
  }
};

/**
 * Remove the current blog from the user's reading list.
 *
 */

const removeFromReadingList = async () => {
  try {
    // Send a DELETE request to the reading list endpoint
    const response = await fetch(`${window.location}/reading-list`, {
      method: "DELETE",
    });

    // Handle case where response is successful
    if (response.ok) {
      $readingListBtn.classList.remove("active");
      $readingListNumber.textContent =
        Number($readingListNumber.textContent) - 1;
    }

    // Handle case where user is not authenticated (status code 401)
    if (response.status === 401) {
      console.log("need to login");
    }
  } catch (error) {
    console.error("Error removing reading list", error.message);
    throw error;
  }
};

// Add a click event listener to the reading list button
$readingListBtn.addEventListener("click", async () => {
  $readingListBtn.setAttribute("disabled", "");

  if ($readingListBtn.classList.contains("active")) {
    await removeFromReadingList();
  } else {
    await addToReadingList();
  }

  $readingListBtn.removeAttribute("disabled");
});
