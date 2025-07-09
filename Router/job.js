// import { Router } from "express"
// import { addJob, allJobs, deleteJob, getAllAppliedJobs, Jobdemo, updateJob } from "../Controller/job.controller.js";
// import { authorizedRole, isAuthenticate } from "../middleware/Auth.Provider.js";
const { Router } = require("express");
const { 
  addJob, 
  allJobs, 
  deleteJob, 
  getAllAppliedJobs, 
  Jobdemo, 
  updateJob 
} = require("../Controller/job.js");
const { 
  authorizedRole, 
  isAuthenticate 
} = require("../middleware/Authprovider.js");

const router = Router();

//job todo
router.post('/create/job', isAuthenticate, authorizedRole("admin"), addJob)
router.get('/demo', Jobdemo)
router.get('/all/jobs', allJobs)
router.put('/update/job', isAuthenticate, authorizedRole("admin"), updateJob)
router.delete('/delete/job/:id', isAuthenticate, authorizedRole("admin"), deleteJob)
router.get('/get/job/query', isAuthenticate, authorizedRole("admin"), getAllAppliedJobs)

module.exports = router;