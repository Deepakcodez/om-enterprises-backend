
const { Router } = require("express");
const {
  addClient,
  getClientById,
  getClients,
  removeClient,
  updateClient
} = require("../Controller/companyClientController.js");
const {
  authorizedRole,
  isAuthenticate
} = require("../middleware/Authprovider.js");
const uploadFromUrl = require("../middleware/multer.js");
const multer = require("multer");

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post(
  "/add/client",
  isAuthenticate,
  authorizedRole("admin"),
  upload.single("image"), // Handle single file upload
  uploadFromUrl,
  addClient
);
router.get("/get/client", getClients);
router.get("/company/client/:id", getClientById);
router.put(
  "/update/client/:id",
  isAuthenticate,
  authorizedRole("admin"),
  upload.single("image"),
  uploadFromUrl,
  updateClient
);
router.delete(
  "/delete/client/:id",
  isAuthenticate,
  authorizedRole("admin"),
  removeClient
);

module.exports = router;