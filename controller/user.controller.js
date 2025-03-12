import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
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

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user:process.env.MAILTRAP_USER_NAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });

    const mailOptions = {
        from: process.env.MAILTRAP_SENDER_EMAIL ,// sender address
        to: User.email, // list of receivers
        subject: "Hello Verify ✔", // Subject line
        text: `Please Click the following link : ${process.BASE_URI}/api/v1/users/verify/${token}`, // plain text body
        html: "<b>Hello world? </b>", // html body
    }
    const result = await transport.sendMail(mailOptions)
    if(result){
      console.log("Email Send")
    }else{
      console.log("Email not send")
    }
  } catch (error) {
    return res.status(400).json({
      message: "error " + error,
    });
  }
  res.send(` Hello ${username} 💖`);
};

export { registeredUser };
