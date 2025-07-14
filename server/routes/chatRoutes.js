import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password")
      .sort({ fullName: 1 });

    const unseenAgg = await Message.aggregate([
      {
        $match: {
          receiverId: currentUserId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unseenMessages = {};
    unseenAgg.forEach((doc) => {
      unseenMessages[doc._id.toString()] = doc.count;
    });

    res.json({ success: true, users, unseenMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
