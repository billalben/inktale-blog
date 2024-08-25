"use strict";

/**
 * Generate the pagination object based given parameters, limit and total number of blogs.
 * @param {string} currentRoute - The current route of the page.
 * @param {object} reqParams - The request parameters object containing the page number.
 * @param {number} limit - The number of blogs to display per page.
 * @param {number} totalBlogs - The total number of blogs in the database.
 * @returns {object} - The pagination object containing next, prev, total and current page information.
 */

const getPagination = (currentRoute, reqParams, limit, totalBlogs) => {
  const currentPage = Number(reqParams.pageNumber) || 1;
  const skip = limit * (currentPage - 1);
  const totalPage = Math.ceil(totalBlogs / limit);

  const paginationObj = {
    next:
      totalBlogs > currentPage * limit
        ? `${currentRoute}page/${currentPage + 1}`
        : null,
    prev:
      skip && currentPage <= totalPage
        ? `${currentRoute}page/${currentPage - 1}`
        : null,
    totalPage,
    currentPage,
    skip,
    limit,
  };

  return paginationObj;
};

module.exports = getPagination;
