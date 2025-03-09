import express from "express";
import { registeredUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/", registeredUser);
router.get("/suraj", registeredUser);

export default router;
