import { Router } from "express";
import { createLecture, getAllLectures, getLectureDetails} from "../controllers/lecture";
const router: Router = Router();

router.get("/", getAllLectures);
router.post("/lecture", createLecture);
router.get("/lectureDetails", getLectureDetails);

export default router;
