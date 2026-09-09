import { Router } from "express";
import { postCreditScore } from "../controllers/credit-score.controller";

const router = Router();

router.post("/credit-score", postCreditScore);

export default router;
