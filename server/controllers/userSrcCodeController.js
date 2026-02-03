import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAVE_DIR = path.join(__dirname, "../saved");
const SUBMIT_DIR = path.join(__dirname, "../submitted");

// if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

export const saveCodeFileWithName = (req, res) => {
    const { code, filename } = req.body;

    if (!code || !filename) {
        return res.status(400).json({ error: "Code or filename not provided" });
    }

    const filePath = path.join(SAVE_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File does not exist, cannot overwrite" });
    }

    fs.writeFile(filePath, code, (err) => {
        if (err) {
            console.error("Error saving file:", err);
            return res.status(500).json({ error: "Failed to save file" });
        }

        res.json({ message: "File saved successfully!"});
    });
};

export const submitCodeFileWithName = (req, res) => {
const { filename } = req.body;
    if (!filename) {
        return res.status(400).json({ error: "Filename not provided" });
    }

    const safeFilename = path.basename(filename);

    const sourcePath = path.join(SAVE_DIR, safeFilename);
    const targetPath = path.join(SUBMIT_DIR, safeFilename);

    if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Source file does not exist" });
    }

    fs.copyFile(sourcePath, targetPath, (err) => {
        if (err) {
        console.error("Error submitting file:", err);
        return res.status(500).json({ error: "Failed to submit file" });
        }

        res.json({ message: "File submitted successfully!" });
    });
};

export const createNewFile = (req, res) => {
    //TODO
};

export const getListOfFileNames = (req, res) => {
    fs.readdir(SAVE_DIR, (err, files) => {
        if (err)
            return res.status(500).json({ error: "Failed to get list of filenames" });
        const fileNamesWithoutExt = files.map(file => path.parse(file).name)
                                         .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        res.json({ files: fileNamesWithoutExt });
    });
};

export const getCodeFileWithName = (req, res) => {
    const {filename, fileStatus} = req.query;
    const dir = fileStatus === "saved" ? SAVE_DIR :
                fileStatus === "submitted" ? SUBMIT_DIR : null;

    const filePath = path.join(dir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File cannot be found or does not exist" });
    }

    const code = fs.readFileSync(filePath, "utf-8");
    res.json({ code });
};