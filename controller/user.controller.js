import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"


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
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USER_NAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDER_EMAIL, // sender address
      to: user.email, // list of receivers

      subject: "Hello Verify ✔", // Subject line
      text: `Please Click the following link : ${process.env.BASE_URI}/api/v1/users/verify/${token}`, // plain text body
    };
    const result = await transport.sendMail(mailOptions);
    if (result) {
      console.log(result);
    } else {
      console.log("Email not send");
    }
  } catch (error) {
    return res.status(400).json({
      message: "error " + error,
    });
  }
  res.send(` Hello ${username} 💖`);
};

const verifyUser = async(req,res)=>{
  //get token from url
  //validate
  // find user based on token
  //if not
  // set isVerified field to true
  // remove verification token
  // save
  //return response

  const {token} = req.params
  
  if(!token){
    return res.status(400).json({
      message: "Invalid Token!",
    });
  }
  let user = await User.findOne({verificationToken:token})
  if(!user){
    return res.status(400).json({
      message: "User dosen't exist!",
    });
  }
  user.isVerified = true
  user.verificationToken=null
  console.log(user)
  await user.save();
}

export { registeredUser,verifyUser };
