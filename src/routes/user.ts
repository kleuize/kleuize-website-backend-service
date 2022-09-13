import { Router } from "express";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../verifyToken";
import {
  deleteUser,
  getAllUser,
  getUser,
  getUserStats,
  updateUser,
} from "../controllers/user";

const router: Router = Router();

router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/find/:id", verifyTokenAndAdmin, getUser);
router.get("/", verifyTokenAndAdmin, getAllUser);
router.get("status", verifyTokenAndAdmin, getUserStats);

export default router;
