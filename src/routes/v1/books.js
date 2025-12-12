const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validationMiddleware');
const { createBookSchema, updateBookSchema } = require('../../validation/bookValidation');

const auth = require('../../middlewares/authMiddleware');
const authorize = require('../../middlewares/roleMiddleware');

const bookController = require('../../controllers/booksController');
const cache = require('../../cache/cacheMiddleware');

// Redis rate limiter
const rateLimiter = require('../../middlewares/redisRateLimiter');

const listLimiter = rateLimiter({ window: 30, limit: 50 });
const statsLimiter = rateLimiter({ window: 60, limit: 20 });
const writeLimiter = rateLimiter({ window: 60, limit: 30 });

// Public routes
router.get('/', listLimiter, cache(30), bookController.listBooks);

router.get('/stats/category', statsLimiter, bookController.stats);

router.get('/:id', cache(60), bookController.getBookById);

// Protected routes
router.post(
  '/',
  auth,
  authorize('superadmin', 'editor'),
  writeLimiter,
  validate(createBookSchema),
  bookController.createBook
);

router.put(
  '/:id',
  auth,
  authorize('superadmin', 'editor'),
  writeLimiter,
  validate(updateBookSchema),
  bookController.updateBook
);

router.patch(
  '/:id',
  auth,
  authorize('superadmin', 'editor'),
  writeLimiter,
  validate(updateBookSchema),
  bookController.updateBook
);

router.delete(
  '/:id',
  auth,
  authorize('superadmin'),
  writeLimiter,
  bookController.deleteBook
);

module.exports = router;
