const User = require("../models/userModels");
const ApiError = require("../utils/ApiError");

exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["superadmin", "editor", "user"];
    if (!validRoles.includes(role)) {
      return next(new ApiError(400, "Invalid role"));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};
