import { Router } from "express";
import { markCompleted, listCompleted } from "../controllers/completed";
import { requireSignin } from "../middlewares";

const router = Router();

router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);

module.exports = router;