"use strict";

const $topAppBar = document.querySelector("[data-top-app-bar]");
let lastScrollPos = 0;

/**
 * Attaches event listener to the window scroll event, toggling classes on the top app bar based on scroll position.
 */

window.addEventListener("scroll", () => {
  // Toggling the 'active' class on the $topAppBar element based on whether the vertical scroll position is greater than 50 pixels
  $topAppBar.classList[window.scrollY > 50 ? "add" : "remove"]("active");

  // Toggling the 'hide' class based on whether the current scroll position is greater than the last scroll position and scroll position is greater than 50 pixels
  $topAppBar.classList[
    window.scrollY > lastScrollPos && window.scrollY > 50 ? "add" : "remove"
  ]("hide");

  // Updating the last scroll position
  lastScrollPos = window.scrollY;
});

/**
 * Toggle Menu
 */

const $menuWrappers = document.querySelectorAll("[data-menu-wrapper]");

$menuWrappers?.forEach(($menuWrapper) => {
  const $menuToggler = $menuWrapper.querySelector("[data-menu-toggler]");
  const $menu = $menuWrapper.querySelector("[data-menu]");

  $menuToggler.addEventListener("click", () => {
    $menu.classList.toggle("active");
  });
});
