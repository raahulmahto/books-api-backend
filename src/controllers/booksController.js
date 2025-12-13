/*
let books = [
  {
    id: 1,
    title: "Bhagvadgeeta as it is - srimad prabhulad - Iskcon",
    author: "Iskcon foundation books",
  },
  {
    id: 2,
    title: "srimadbhagvatham",
    author: "online library books",
  },
];

exports.getAllBooks = (req, res) => {
  res.json(books);
};

//creating books

exports.createBooks = (req, res) => {
  const newBooks = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
  };

  books.push(newBooks);
  res.status(201).json(newBooks);
};

//updating the books
exports.updateBooks = (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) return res.status(404).json({ message: "Book not found" });

  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;

  res.json(book);
};

//get singlebookid

exports.getBooksById = (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) return res.status(404).json({ message: "not found" });

  res.json(book);
};

//deleting books
exports.deleteBooks = (req, res) => {
  const bookId = parseInt(req.params.id);
  const deletedBooks = books.find((b) => b.id === bookId);

  if (!deletedBooks) {
    return res.status(404).json({ message: "book not found" });
  }

  books = books.filter((b) => b.id !== bookId);

  res.json({ message: "successfully removed the book" });
};
*/

//----------------------------------------------------------------------------------//

//COMPLETE CODE USING CONNECTORS (MONGO DB)
/*const Book = require("../models/bookModels");

exports.createBooks = async (req, res, next) => {
  try {
    const { title, author } = req.body;
    const book = await Book.create({ title, author });
    res.status(201).json({
      success: true,   //improved api
      data: book,
    });
  } catch (error) {
   //improved api below res.status(400).json({ message: error.message }); 
   next(error);
  }
};

//find by id books all

exports.getAllBooks = async (req, res, next) => {
  try {
    //pagination 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt";
    const skip = (page-1)*limit;

    //search 
    let query = {};

    if(req.query.author){
      query.author = {$regex: req.query.author, $options: "i"};
    }

    if(req.query.search){
      query.title = {$regex: req.query.search, $options: "i"};
    }

    const books = await Book.find()
    .sort(sort)
    .skip(skip)
    .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total/limit),
      data: books
    });
  } catch (error) {
    next(error);
  }
};

//get book by id search

exports.getBooksById = async (req, res, next) => {
  try {
    // improved one below const { id } = req.params;
    const book = await Book.findById(req.params.id);
    if (!book) 
      return res.status(404).json({
       success: false, 
       message: "Book not found" });
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
     next(error);
   // res.status(400).json({ message: error.message });
  }
};

//delete books
exports.deleteBooks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ message: "successfully deleted" });
  } catch (error) {
    //res.status(400).json({ message: error.message });
    next(error);
  }
};

//update the code
exports.updateBooks = async (req, res, next) => {
  try {
    const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateBook)
      return res.status(400).json({ success: false, message: "book not found " });

    res.json({success: true, data:updateBook});
  } catch (error) {
    //res.status(400).json({ message: error.message });
    next(error);
  }
};
*/
//---------------------------------------------------------------------------
//FULL FINAL CODE 
/*
const bookService = require('../services/bookService');
const { buildPagination, buildSort, buildFilters } = require('../utils/queryBuilder');
const ApiError = require('../utils/ApiError');

async function createBook(req, res, next) {
  try {
    // attach owner from authenticated user if present
    const ownerId = req.user?.id;
    const book = await bookService.createBook(req.body, ownerId);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function listBooks(req, res, next) {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const { sort } = buildSort(req.query.sort);
    const filter = buildFilters(req.query);

    const { data, total } = await bookService.getList({ filter, sort, skip, limit });

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getBookById(req, res, next) {
  try {
    const book = await bookService.getById(req.params.id);
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const updated = await bookService.updateBook(req.params.id, req.body, req.user);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const deleted = await bookService.deleteBook(req.params.id, req.user);
    res.json({ success: true, data: deleted, message: 'Book deleted (soft)' });
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    const data = await bookService.statsByCategory();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBook, listBooks, getBookById, updateBook, deleteBook, stats }; */

//---------------------------------------REDIS UPDATED CODE-------------------------//
// src/controllers/bookController.js

const bookService = require('../services/bookService');
const { buildPagination, buildSort, buildFilters } = require('../utils/queryBuilder');
const ApiError = require('../utils/ApiError');
const { client: redis } = require('../cache/redisClient'); // <-- added

// Helper: clear cache for list + specific item
async function invalidateBookCache(bookId) {
  try {
    await redis.del("cache:/books");                // list endpoint (no query)
    await redis.del(`cache:/books/${bookId}`);      // get by id
  } catch (err) {
    console.warn("Redis cache invalidation failed:", err.message);
  }
}

async function createBook(req, res, next) {
  try {
    const ownerId = req.user?.id;
    const book = await bookService.createBook(req.body, ownerId);

    // clear list cache (new book affects list)
    await invalidateBookCache(book._id);

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function listBooks(req, res, next) {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const { sort } = buildSort(req.query.sort);
    const filter = buildFilters(req.query);

    const { data, total } = await bookService.getList({ filter, sort, skip, limit, reqQuery: req.query });

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    next(err);
  }
}


async function getBookById(req, res, next) {
  try {
    const book = await bookService.getById(req.params.id);
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const updated = await bookService.updateBook(req.params.id, req.body, req.user);

    // update invalidates both list + item cache
    await invalidateBookCache(req.params.id);

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const deleted = await bookService.deleteBook(req.params.id, req.user);

    // deletion invalidates caches
    await invalidateBookCache(req.params.id);

    res.json({ success: true, data: deleted, message: 'Book deleted (soft)' });
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    const data = await bookService.statsByCategory();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBook, listBooks, getBookById, updateBook, deleteBook, stats };



