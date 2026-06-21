import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_CONFIGS_DIR = path.join(__dirname, "../testconfigs");

export const getTestEnvironmentConfigNames = (req, res) => {
    fs.readdir(TEST_CONFIGS_DIR, (err, files) => {
        if (err)
            return res.status(500).json({ error: "Failed to get list of filenames" });
        const fileNamesWithoutExt = files.map(file => path.parse(file).name)
                                         .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        res.json({ fileNames: fileNamesWithoutExt });
    });
};

export const getTestEnvironmentConfig = (req, res) => {

    const {filename} = req.query;
    const dir = TEST_CONFIGS_DIR;

    const filePath = path.join(dir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File cannot be found or does not exist" });
    }

    const code = fs.readFileSync(filePath, "utf-8");
    const configData = JSON.parse(code);

    setTimeout(() => {
        res.json({ configData });
    }, 500)
};