const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validationMiddleware');
const { createBookSchema, updateBookSchema } = require('../validation/bookValidation');

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const bookController = require('../controllers/booksController');

// Public routes
router.get('/', bookController.listBooks);
router.get('/stats/category', bookController.stats);
router.get('/:id', bookController.getBookById);

// Protected + role-based routes
router.post(
  '/',
  auth,
  authorize('superadmin', 'editor'),
  validate(createBookSchema),
  bookController.createBook
);

router.put(
  '/:id',
  auth,
  authorize('superadmin', 'editor'),
  validate(updateBookSchema),
  bookController.updateBook
);

router.patch(
  '/:id',
  auth,
  authorize('superadmin', 'editor'),
  validate(updateBookSchema),
  bookController.updateBook
);

router.delete(
  '/:id',
  auth,
  authorize('superadmin'),
  bookController.deleteBook
);

module.exports = router;
