import User from "../model/User.model.js";
import crypto from "crypto";
const registeredUser = async (req, res) => {

  let { username, email, password } = req.body;
  let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are Required!",
    });
  } else if (password.length <= 8) {
    return res.status(400).json({
      message: "Password at least 8 character!",
    });
  } else if (password === password.toLowerCase()) {
    return res.status(400).json({
      message: "Password is write in lowercase",
    });
  } else if (!regex.test(password)) {
    return res.status(400).json({
      message: "Password is include at-least one special characters",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already exists!",
      });
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;

    await user.save();

  } catch (error) {
    return res.status(400).json({
      message: "error " + error,
    });
  }
  res.send(` Hello ${username} 💖`);
};

export { registeredUser };
