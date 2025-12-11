const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true, 
    lowercase: true,
  }, 
  password: {
    type: String, 
    required: [true, "Password is mandatory"],
    minlength: 6,
  },
  role: {
    type: String, 
    enum: ["superadmin, editor, user"],
    default: "user",
  }
}, {timestamps: true});

//hashpassword before we save 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



module.exports = mongoose.model("User", userSchema);