const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectDB = require("./db")
const dotenv = require("dotenv")
const File = require("./upload.model")
dotenv.config();

const app = express();
connectDB();

app.use(cors())
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // folder to store files
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
    return res.json("Working");
});

// ========== UPLOAD ROUTE ==========
app.post("/upload", express.json({ limit: "100mb" }), async (req, res) => {
    // console.log(req.body)
    const { fileName, fileType, data, teamData, fileSize } = req.body;


    if (!data || !fileName) {
        return res.status(400).json({ message: "Missing file or data" });
    }

    const buffer = Buffer.from(data, "base64");
    console.log(teamData.teamId)
    const newFileName = `${teamData.teamId}_${teamData.teamName}_${fileName}`;
    const savePath = path.join(__dirname, "public", "uploads", newFileName);
    fs.writeFileSync(savePath, buffer);

    const uploadFile = await File.create({
        teamName: teamData.teamName,
        teamId: teamData.teamId,
        originalName: fileName, // name uploaded by user
        fileName: newFileName,     // stored name on server
        fileType: fileType,     // e.g. image/png
        size: fileSize,         // file size in bytes
        path: "uploads/" + path.basename(savePath),
    })

    console.log(uploadFile)

    res.json({
        message: "File uploaded successfully",
        url: "/uploads/" + path.basename(savePath)
    });
});

// ==================================

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
