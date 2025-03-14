import express from "express";
import { registeredUser,verifyUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/verify/:token",verifyUser)
router.post("/register", registeredUser);


export default router;
