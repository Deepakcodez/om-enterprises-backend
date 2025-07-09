// import { Router } from "express"
// import { applyJob } from "../../Controller/job.controller.js";
// import multer from "multer";
// import uploadFromUrl from "../../middleware/multer.js";
const { Router } = require("express");
const { applyJob } = require("../../Controller/job.js");
const multer = require("multer");
const uploadFromUrl = require("../../middleware/multer.js");

const router = Router();
const upload = multer({ dest: "uploads/" });



router.post('/apply/job', 
    upload.single("resume"), // Handle single file upload
    uploadFromUrl,
    applyJob)

// title price 5 description []

module.exports = router;