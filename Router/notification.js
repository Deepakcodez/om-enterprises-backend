const { Router } = require("express");
const { 
  authorizedRole, 
  isAuthenticate 
} = require("../middleware/Authprovider.js");
const { 
  getAllNotification 
} = require("../Controller/notification.js");

const router = Router();


router.get("/all", isAuthenticate, authorizedRole("admin"), getAllNotification);

module.exports = router;