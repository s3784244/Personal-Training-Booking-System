import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: String, required: true },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      day: {
        type: String,
        required: true,
      },
      startingTime: {
        type: String,
        required: true,
      },
      endingTime: {
        type: String,
        required: true,
      }
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }  
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "trainer",
    select: "name specialization photo",
  });
  next();
});


export default mongoose.model("Booking", bookingSchema);
