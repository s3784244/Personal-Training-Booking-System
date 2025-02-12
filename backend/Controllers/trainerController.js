import Trainer from "../models/TrainerSchema.js";

export const updateTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTrainer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    await Trainer.findByIdAndDelete(
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

export const getSingleTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    const trainer = await Trainer.findById(id).populate('reviews').select("-password");

    res.status(200).json({
      success: true,
      message: "Trainer found",
      data: trainer,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No trainer found" });
  }
};

export const getAllTrainer = async (req, res) => {

  try {
    const {query} = req.query
    let trainers;

    if(query){
      trainers = await Trainer.find({isApproved: 'approved', 
        $or:[
          {name: {$regex: query, $options: 'i'}}, 
          {specialization: {$regex: query, $options: 'i'}}
        ],
      }).select("-password");  
    } else {
      trainers = await Trainer.find({isApproved: 'approved'}).select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Trainers found",
      data: trainers,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

