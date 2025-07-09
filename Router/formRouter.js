
const { Router } = require("express");
const { 
  allInstantCallBackQueries, 
  getAllContactQueries, 
  instantCallBackQuery, 
  postContactUs 
} = require("../Controller/instantCall.js");
const { 
  authorizedRole, 
  isAuthenticate 
} = require("../middleware/Authprovider.js");


const router = Router();

//footer form
router.post("/instant/call", instantCallBackQuery);
router.get("/instant/call",
    isAuthenticate,
    authorizedRole("admin"),
    allInstantCallBackQueries);


//contact us
router.post("/form/contact", postContactUs);
router.get("/form/contact",
    isAuthenticate,
    authorizedRole("admin"),
    getAllContactQueries);

module.exports = router;