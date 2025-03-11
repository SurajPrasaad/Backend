import express from "express";
import { registeredUser } from "../controller/user.controller.js";

const router = express.Router();


router.post("/register", registeredUser);


export default router;
