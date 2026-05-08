import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.id = decode.userId;
    next();

  } catch (error) {
    console.log("Auth Error:", error.message);
    // CRITICAL: You must send a response here so the frontend doesn't stay "Pending"
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};
export default isAuthenticated;
