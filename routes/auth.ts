import { Router } from "express";
import { login, register, logout, currentUser, sendTestEmail } from "../controllers/auth";
import { requireSignin } from "../middlewares";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.get("/send-email", sendTestEmail)

module.exports = router;
