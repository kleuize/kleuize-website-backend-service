import { Router } from "express";
import {
  chechoutController,
  chechoutInitialize,
} from "../controllers/checkout";
import { requireSignin, isEnrolled } from "../middlewares";

const router = Router();

router.post(
  "/checkout/initialize/payment",
  chechoutInitialize
);
router.post("/checkout/complete/payment", chechoutController);

module.exports = router;
