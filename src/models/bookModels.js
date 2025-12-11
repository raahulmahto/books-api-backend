const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300, index: true },
    author: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, index: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 }, // percentage
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    images: [{ type: String }], // urls
    publisher: { type: String, trim: true },
    isbn: { type: String, unique: true, sparse: true, trim: true },
    publishedYear: { type: Number, min: 1000, max: 9999 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // who created the book (optional)
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    meta:{
      views:{type: Number, default:0},
      tags:[{type: String, index: true}],
    },

  },{timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

//text index for searching title author and desc
bookSchema.index({title: 'text', author: 'text', description: 'text'});

//compound index frequently used in filters/dorts
bookSchema.index({category:1, price:1});
bookSchema.index({owner:1, createdAt: -1});

//soft deleter helper
bookSchema.methods.softDelete = async function (){
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

module.exports = mongoose.model("Books", bookSchema);
