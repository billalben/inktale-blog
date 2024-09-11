"use strict";

import Snackbar from "./utils/snackbar.js";

const $blogDeleteBtnAll = document.querySelectorAll("[data-blog-delete-btn]");

/**
 * DELETE request to the server to delete a specific blog
 * @async
 * @param {string} blogId - The unique identifier of the blog to be deleted
 * @returns {Promise<void>} - Promise resolving when the deletion operation is completed
 */
const handleBlogDelete = async (blogId) => {
  const confirmDelete = confirm("Are you sure you want to delete this blog?");

  // Handle case when user cancels the deletion operation
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `${window.location.origin}/blogs/${blogId}/delete`,
      {
        method: "DELETE",
      }
    );

    // Handle case when the response is successful
    if (response.ok) {
      Snackbar({ message: "Blog deleted successfully" });
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Attaches click event listeners to all delete buttons to trigger the handleBlogDelete function.

$blogDeleteBtnAll.forEach(($deleteBtn) => {
  const blogId = $deleteBtn.dataset.blogDeleteBtn;
  $deleteBtn.addEventListener("click", handleBlogDelete.bind(null, blogId));
});
