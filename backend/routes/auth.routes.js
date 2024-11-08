import express from "express";
import {
  handleLogin,
  handleLogout,
  handleSignup,
  getMe
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

export default router;
