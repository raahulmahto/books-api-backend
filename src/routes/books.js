const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { bookSchema } = require("../validations/bookValidation");
const protect = require("../middlewares/authMidlleware");

const {
  getAllBooks,
  createBooks,
  updateBooks,
  deleteBooks,
  getBooksById,
} = require("../controllers/booksController");

//GET BOOKS

//safer order
router.get("/:id", getBooksById);
router.put("/:id", validate(bookSchema), updateBooks);
router.delete("/:id", deleteBooks);

//list + filters
router.get("/", getAllBooks);

//create 
router.post("/", validate(bookSchema), createBooks);




module.exports = router;
