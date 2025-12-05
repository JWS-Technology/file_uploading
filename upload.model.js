const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
    {
        teamName: { type: String },
        teamId: { type: String },
        originalName: { type: String }, // name uploaded by user
        fileName: { type: String },     // stored name on server
        fileType: { type: String },     // e.g. image/png
        size: { type: Number },         // file size in bytes
        path: { type: String },         // local path or S3 key
    },
    { timestamps: true } // auto adds createdAt & updatedAt
);

// Prevent model overwrite errors in dev
module.exports =
    mongoose.models.File || mongoose.model("File", FileSchema);
