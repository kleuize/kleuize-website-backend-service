import express from "express";
import { requireSignin } from "../middlewares";
import {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
  studentCount,
} from "../controllers/instructor";

const router = express.Router();
router.post("/make-instructor", requireSignin, makeInstructor);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.get("/current-instructor", requireSignin, currentInstructor);
router.get("/instructor-courses", requireSignin, instructorCourses);
router.post("/instructor/student-count", requireSignin, studentCount);

module.exports = router;
