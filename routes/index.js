import express from "express";
import { homeRoute, validateRoute } from "../controllers/index.js";
import { validateMiddleware } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", homeRoute);

router.post("/validation-rule", validateMiddleware, validateRoute);

export default router;
