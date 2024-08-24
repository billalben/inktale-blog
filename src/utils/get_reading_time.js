"use strict";

/**
 * Calculates the reading time for a given text.
 * @param {string} text - The text to calculate the reading time for.
 * @returns {number} - The reading time in minutes.
 */

const AVR_READ_WPM = 200; // Average reading speed in words per minute
const getReadingTime = (text) => {
  const words = text.split(" ").length;
  return Math.ceil(words / AVR_READ_WPM);
};

module.exports = getReadingTime;
