/**
 * Pagination utility
 */

export function paginate(rows, page = 1, limit = 15) {
  const total = rows.length;
  const start = (page - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}
