const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBooks,
  updateBooks,
  deleteBooks,
  getBooksById,
} = require("../controllers/booksController");

//GET BOOKS

router.get("/", getAllBooks);
router.post("/", createBooks);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);
router.get("/:id", getBooksById);

module.exports = router;
