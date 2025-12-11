// this code is to build mongo query, sort, skip, limit from request 
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function buildPagination(query) {
  const page = Math.max(parseInt(query.page) || DEFAULT_PAGE, 1);
  let limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

  if (limit <= 0) limit = DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function buildSort(sortQuery) {
  if (!sortQuery) return { sort: { createdAt: -1 } };

  const fields = String(sortQuery)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const sort = {};

  fields.forEach((f) => {
    if (f.startsWith('-')) sort[f.substring(1)] = -1;
    else sort[f] = 1;
  });

  return { sort };
}

function buildFilters(query) {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.author) filter.author = { $regex: query.author, $options: 'i' };

  if (query.minPrice) {
    filter.price = { ...(filter.price || {}), $gte: parseFloat(query.minPrice) };
  }
  if (query.maxPrice) {
    filter.price = { ...(filter.price || {}), $lte: parseFloat(query.maxPrice) };
  }

  if (query.tags) {
    filter['meta.tags'] = {
      $in: String(query.tags).split(',').map(t => t.trim())
    };
  }

  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  if (query.owner) filter.owner = query.owner;

  // full text search
  if (query.search) filter.$text = { $search: query.search };

  return filter;
}

module.exports = { buildPagination, buildSort, buildFilters };
