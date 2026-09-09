import { Router } from "express";
import healthRoute from "./health.route";
import creditScoreRoute from "./credit-score.route";

const router = Router();

router.use(healthRoute);
router.use(creditScoreRoute);

export default router;
