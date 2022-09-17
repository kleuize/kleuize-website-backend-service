import express from "express";
import { requireSignin } from "../middlewares";
import { makeInstructor } from "../controllers/instructor";


const router = express.Router();
router.post("/make-instructor", requireSignin, makeInstructor);

module.exports = router;
