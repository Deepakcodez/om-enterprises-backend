

const { Router } = require("express");
const uploadFromUrl = require("../middleware/multer.js");
const {
  allEmployees,
  deleteEmployee,
  employeeController,
  updateEmployee
} = require("../Controller/employeeController.js");
const multer = require("multer");
const { 
  authorizedRole, 
  isAuthenticate 
} = require("../middleware/Authprovider.js");


const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/employee",
  isAuthenticate,
  authorizedRole("admin"),
  upload.single("image"), // Handle single file upload
  uploadFromUrl,
  employeeController
);
router.put(
  "/employee/:id",
  isAuthenticate,
  authorizedRole("admin"),  
  updateEmployee
);
router.get("/employee", allEmployees);
router.delete(
  "/employee/:id",
  isAuthenticate,
  authorizedRole("admin"),
  deleteEmployee
);

module.exports = router;