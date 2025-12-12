/*const bookRepo = require('../repositories/bookRepository');
const ApiError = require('../utils/ApiError');

async function createBook(payload, ownerId = null) {
  if (ownerId) payload.owner = ownerId;
  // final price after discount
  if (payload.discount && payload.discount > 0) {
    payload.finalPrice = +(payload.price * (1 - payload.discount / 100)).toFixed(2);
  }
  const book = await bookRepo.create(payload);
  return book;
}

async function getList(queryOptions) {
  const { filter = {}, projection = null, sort = { createdAt: -1 }, skip = 0, limit = 10 } = queryOptions;
  const [data, total] = await Promise.all([
    bookRepo.find(filter, projection, { sort, skip, limit }),
    bookRepo.count(filter),
  ]);
  return { data, total };
}

async function getById(id) {
  const book = await bookRepo.findById(id);
  if (!book) throw new ApiError(404, 'Book not found');
  return book;
}

async function updateBook(id, updatePayload, currentUser) {
  // RBAC editors and superadmin can update owners can also update their own books
  const existing = await bookRepo.findById(id);
  if (!existing) throw new ApiError(404, 'Book not found');

  // ownership check advance
  if (currentUser) {
    const isOwner = String(existing.owner) === String(currentUser.id);
    const allowedRoles = ['superadmin', 'editor'];
    if (!isOwner && !allowedRoles.includes(currentUser.role)) {
      throw new ApiError(403, 'Forbidden');
    }
  }

  const updated = await bookRepo.updateById(id, updatePayload);
  return updated;
}

async function deleteBook(id, currentUser) {
  const existing = await bookRepo.findById(id);
  if (!existing) throw new ApiError(404, 'Book not found');

  // enforce role/ownership
  if (currentUser) {
    const isOwner = String(existing.owner) === String(currentUser.id);
    const allowedRoles = ['superadmin'];
    if (!isOwner && !allowedRoles.includes(currentUser.role)) {
      throw new ApiError(403, 'Forbidden');
    }
  }

  // soft delete
  const deleted = await bookRepo.deleteById(id);
  return deleted;
}

async function statsByCategory() {
  const pipeline = [
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { count: -1 } },
  ];
  return bookRepo.aggregate(pipeline);
}

module.exports = { createBook, getList, getById, updateBook, deleteBook, statsByCategory }; */

const bookRepo = require('../repositories/bookRepository');
const ApiError = require('../utils/ApiError');

const { connectRedis } = require('../cache/redisClient');
const DEFAULT_TTL = Number(process.env.REDIS_CACHE_TTL || 30);

function listCacheKey(query) {
  return `books:list:${encodeURIComponent(JSON.stringify(query))}`;
}

function detailCacheKey(id) {
  return `books:detail:${id}`;
}

const LIST_PATTERN = 'books:list:*';


async function createBook(payload, ownerId = null) {
  if (ownerId) payload.owner = ownerId;

  if (payload.discount && payload.discount > 0) {
    payload.finalPrice = +(payload.price * (1 - payload.discount / 100)).toFixed(2);
  }

  const book = await bookRepo.create(payload);

  const redis = await connectRedis();
  if (redis) {
    try {
      await redis.del(detailCacheKey(book._id.toString()));
      for await (const key of redis.scanIterator({ MATCH: LIST_PATTERN })) {
        await redis.del(key);
      }
    } catch (err) {
      console.error("Redis invalidation error (createBook):", err);
    }
  }

  return book;
}



async function getList(queryOptions) {
  const { filter = {}, projection = null, sort = { createdAt: -1 }, skip = 0, limit = 10 } = queryOptions;

  const redis = await connectRedis();
  const cacheKey = listCacheKey({ filter, projection, sort, skip, limit });

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err) {
      console.error("Redis getList cache error:", err);
    }
  }

  const [data, total] = await Promise.all([
    bookRepo.find(filter, projection, { sort, skip, limit }),
    bookRepo.count(filter),
  ]);
  const result = { data, total };

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), { EX: DEFAULT_TTL });
    } catch (err) {
      console.error("Redis setList cache error:", err);
    }
  }

  return result;
}



async function getById(id) {
  const redis = await connectRedis();
  const cacheKey = detailCacheKey(id);

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err) {
      console.error("Redis getById cache error:", err);
    }
  }

  const book = await bookRepo.findById(id);
  if (!book) throw new ApiError(404, 'Book not found');

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(book), { EX: DEFAULT_TTL });
    } catch (err) {
      console.error("Redis setById cache error:", err);
    }
  }

  return book;
}



async function updateBook(id, updatePayload, currentUser) {
  const existing = await bookRepo.findById(id);
  if (!existing) throw new ApiError(404, 'Book not found');

  const isOwner = currentUser && String(existing.owner) === String(currentUser.id);
  const allowedRoles = ['superadmin', 'editor'];

  if (!isOwner && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    throw new ApiError(403, 'Forbidden');
  }

  const updated = await bookRepo.updateById(id, updatePayload);

  const redis = await connectRedis();
  if (redis) {
    try {
      await redis.del(detailCacheKey(id));
      for await (const key of redis.scanIterator({ MATCH: LIST_PATTERN })) {
        await redis.del(key);
      }
    } catch (err) {
      console.error("Redis invalidation error (updateBook):", err);
    }
  }

  return updated;
}



async function deleteBook(id, currentUser) {
  const existing = await bookRepo.findById(id);
  if (!existing) throw new ApiError(404, 'Book not found');

  const isOwner = currentUser && String(existing.owner) === String(currentUser.id);
  const allowedRoles = ['superadmin'];

  if (!isOwner && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    throw new ApiError(403, 'Forbidden');
  }

  const deleted = await bookRepo.deleteById(id);

  const redis = await connectRedis();
  if (redis) {
    try {
      await redis.del(detailCacheKey(id));
      for await (const key of redis.scanIterator({ MATCH: LIST_PATTERN })) {
        await redis.del(key);
      }
    } catch (err) {
      console.error("Redis invalidation error (deleteBook):", err);
    }
  }

  return deleted;
}



async function statsByCategory() {
  const pipeline = [
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { count: -1 } },
  ];
  return bookRepo.aggregate(pipeline);
}

module.exports = { createBook, getList, getById, updateBook, deleteBook, statsByCategory };



