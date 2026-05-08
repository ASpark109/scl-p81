import express from "express";

import { getTestEnvironmentConfigNames, getTestEnvironmentConfig } from "../controllers/testEnvConfigController.js"; 

const router = express.Router();

router.get("/testconfigs", getTestEnvironmentConfigNames);
router.get("/gettestconfig", getTestEnvironmentConfig);

export default router