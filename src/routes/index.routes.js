import { Router } from "express";
import costumerRoutes from "./customers.routes.js";
import gameRoutes from "./games.routes.js";
import rentalRoutes from "./rental.routes.js";

const router = Router();
router.use(costumerRoutes);
router.use(gameRoutes);
router.use(rentalRoutes);

export default router;