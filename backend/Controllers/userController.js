import User from "../models/UserSchema.js";
import BookingSchema from "../models/BookingSchema.js";
import TrainerSchema from "../models/TrainerSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(
      id,
    );

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

export const getAllUser = async (req, res) => {

  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if(!user) {
      res.status(404).json({
        success: false,
        message: "User found",
      });
  }
  const { password, ...rest } = user._doc;
  res.status(200).json({success:true, message:'Profile infor is getting,', data: {...rest}});

  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get" });
  }
}

export const getMyBookings = async(req, res) => {

  try {
    // step 1 - retrive bookings for specific user
    const bookings = await BookingSchema.find({ user: req.userId });

    // step 2 - extract trainer id from bookings
    const trainerIds = bookings.map(el => el.trainer);

    // step 3 - retrieve trainers using trainer ids
    const trainers = await TrainerSchema.find({ _id: { $in: trainerIds } }).select("-password");
    res.status(200).json({ success: true, message: "Bookings found", data: trainers });
  } catch {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get" });
  }
}

