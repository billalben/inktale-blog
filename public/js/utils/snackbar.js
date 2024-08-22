"use strict";

const $snackbarWrapper = document.querySelector("[data-snackbar-wrapper]");
let lastTimeout = null;

/**
 * Create a snackbar component and display it with specific props
 * @param {object} props - The props of the snackbar
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of the snackbar (optional). value: 'error' | null
 */

const Snackbar = (props) => {
  // Create the snackbar element
  const $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");
  props.type && $snackbar.classList.add(props.type);
  $snackbar.innerHTML = `<p class="body-medium snackbar-text">${props.message}</p>`;

  // Clear previous snackbar and append the new one
  $snackbarWrapper.innerHTML = "";
  $snackbarWrapper.appendChild($snackbar);

  // Remove the snackbar after 8 seconds
  lastTimeout && clearTimeout(lastTimeout);
  lastTimeout = setTimeout(() => {
    $snackbarWrapper.removeChild($snackbar);
  }, 8000);
};

export default Snackbar;
