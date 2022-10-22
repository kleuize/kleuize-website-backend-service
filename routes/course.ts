import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { isInstructor, requireSignin, isEnrolled } from "../middlewares";

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  userCourses,
  createQuiz,
  getQuiz,
  allQuiz,
  paidEnrollment,
  stripeSuccess,
  markCompleted,
  listCompleted,
  markIncomplete
} from "../controllers/course";

router.get("/courses", courses);
router.get("/quizzes", allQuiz);
// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);
// quiz
router.get("./course/lessons/quiz/:quizId", getQuiz);

// publish unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,
router.post("/course/lesson/:slug/:instructorId/", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);
//Question
router.post(
  "/course/lesson/:slug/:instructorId/:lessonId/add-quiz",
  requireSignin,
  createQuiz
);
router.get("/course/lesson/:slug/:quizId", getQuiz)
router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);

router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);
router.get("/user/lessons/:slug", requireSignin, isEnrolled, getQuiz);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);
module.exports = router;
