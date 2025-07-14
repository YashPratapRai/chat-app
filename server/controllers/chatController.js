import User from '../models/User.js';
import Message from '../models/Message.js';

export const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");

    const unseenMessages = {};

    // Count unseen messages from each user to the logged-in user
    for (const user of allUsers) {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: req.user._id,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    }

    res.json({ success: true, users: allUsers, unseenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
