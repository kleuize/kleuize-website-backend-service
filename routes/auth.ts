import { Router } from "express";
import {
  login,
  register,
  logout,
  currentUser,
  resetPassword,
  forgotPassword,
} from "../controllers/auth";
import { requireSignin } from "../middlewares";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
