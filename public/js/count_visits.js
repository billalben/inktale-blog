"use strict";

/**
 * Increments the visit count for the current blog post and updates the local storage.
 * @async
 * @function countVisit
 * @throws {Error} - Throws an error if there is an issue with the request.
 */
const countVisit = async () => {
  try {
    // Increment the visit count
    const response = await fetch(`${window.location.href}/visit`, {
      method: "PUT",
    });

    // If the response is successful, update the visitedBlogs array and local storage
    if (response.ok) {
      visitedBlogs.push(window.location.pathname);
      localStorage.setItem("visitedBlogs", JSON.stringify(visitedBlogs));
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get visitedBlogs from localStorage
let visitedBlogs = localStorage.getItem("visitedBlogs");

// Initial visitedBlogs if it doesn't exist
if (!visitedBlogs) {
  localStorage.setItem("visitedBlogs", JSON.stringify([]));
}

// Parse visited blog from json to array
visitedBlogs = JSON.parse(localStorage.getItem("visitedBlogs"));

// If user visited for the first time then call the countVisit function
if (!visitedBlogs.includes(window.location.pathname)) {
  countVisit();
}
