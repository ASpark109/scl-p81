import express from "express";
import cors from "cors";

import userSrcCode from "./routes/userSrcCode.js";
import testenvconfig from "./routes/testenvconfig.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/usersrc", userSrcCode);
app.use("/testenv", testenvconfig);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));