export interface Pagination {
  next: string | null;
  prev: string | null;
  totalPage: number;
  currentPage: number;
  skip: number;
  limit: number;
}

export function getPagination(
  currentRoute: string,
  reqParams: { pageNumber?: string },
  limit: number,
  totalBlogs: number,
): Pagination {
  const currentPage = Number(reqParams.pageNumber) || 1;
  const skip = limit * (currentPage - 1);
  const totalPage = Math.ceil(totalBlogs / limit);

  return {
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
}
