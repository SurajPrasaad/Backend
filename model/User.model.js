import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 8,
      index: { unique: true },
    },
    email: {
      type: mongoose.SchemaTypes.email,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
