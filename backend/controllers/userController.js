import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

// New Registration of User
export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username already exist. Try different!" });
    }

    // Password hashed to maintain security.
    const hashedPassword = await bcrypt.hash(password, 10);

    //Profile Photos
    const maleProfilePhoto = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XcZeOyQUF35CuG7kddgs3HFhiTa5I0wDBQ&s?=${username}.jpg`;

    const femaleProfilePhoto = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRumd-Z9wdBnnDYHzvGBxOBwNQu7CZzjiewBw&s?=${username}.jpg`;

    await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });

    return res.status(201).json({
        message: "Account created successfully.",
        success:true
    })
  } catch (error) {
    console.log(error);
  }
};
