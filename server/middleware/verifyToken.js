import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded me _id hona chahiye
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};
