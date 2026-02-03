import express from "express";

import { saveCodeFileWithName,
         submitCodeFileWithName,
         getListOfFileNames,
         getCodeFileWithName,
         createNewFile} from "../controllers/userSrcCodeController.js"; 

const router = express.Router();

router.post("/save", saveCodeFileWithName);
router.post("/submit", submitCodeFileWithName);
router.post("/", createNewFile)
router.get("/filenames", getListOfFileNames);
router.get("/getfile", getCodeFileWithName);

export default router