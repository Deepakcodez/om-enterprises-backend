const JobForm  = require("../models/job/job.js");
const JobApplyForm = require("../models/job/jobApply.js");



const mongoose = require('mongoose');

const Jobdemo = async (req, res) => {
  const response = {
    timestamp: new Date().toISOString(),
    success: false,
    dbConnection: {},
    serverInfo: {},
    error: null
  };

  try {
    // 1. Check MongoDB connection status
    response.dbConnection = {
      status: mongoose.connection.readyState,
      statusText: getStatusText(mongoose.connection.readyState),
      host: mongoose.connection?.host || null,
      port: mongoose.connection?.port || null,
      databaseName: mongoose.connection?.name || null,
      models: mongoose.modelNames(),
      collections: await getCollectionsList(),
      lastQueryTime: mongoose.connection?.lastQueryTime || null
    };

    // 2. Add server information
    response.serverInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };

    // 3. Test a simple query if connected
    if (mongoose.connection.readyState === 1) {
      const testResult = await testDatabaseQuery();
      response.dbConnection.testQuery = testResult;
    }

    // 4. Prepare success response
    response.success = true;
    console.log('Jobdemo success:', JSON.stringify(response, null, 2));
    
    return res.status(200).json(response);

  } catch (error) {
    // 5. Comprehensive error handling
    response.error = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      type: error.name,
      code: error.code || 'UNKNOWN_ERROR',
      additionalInfo: getMongoErrorDetails(error)
    };

    console.error('Jobdemo error:', {
      error: response.error,
      context: {
        dbConnection: response.dbConnection,
        serverInfo: response.serverInfo
      }
    });

    return res.status(500).json(response);
  }
};

// Helper functions
function getStatusText(status) {
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };
  return statusMap[status] || "Unknown status";
}

async function getCollectionsList() {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      return collections.map(c => c.name);
    }
    return [];
  } catch (err) {
    return `Failed to get collections: ${err.message}`;
  }
}

async function testDatabaseQuery() {
  try {
    // Simple test query - adjust based on your collections
    const result = await mongoose.connection.db.command({ ping: 1 });
    return {
      operation: "ping",
      ok: result.ok,
      duration: `${result.durationMillis}ms` || 'N/A'
    };
  } catch (err) {
    return {
      operation: "ping",
      error: err.message
    };
  }
}

function getMongoErrorDetails(error) {
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    return {
      errorLabels: error.errorLabels,
      codeName: error.codeName,
      writeConcernError: error.writeConcernError,
      errInfo: error.errInfo
    };
  }
  return null;
}



const addJob = async (req, res) => {
  try {
    const { title, qualification, gender, skill, mandatoryskill, location } = req.body;
    console.log(req.body);
    if (!title && !qualification && !gender && !skill && !location && !mandatoryskill) {
      return res.status(400).json({ message: "provide all details" });
    }
    const newJob = await JobForm.create({
      title,
      qualification,
      gender,
      mandatory: mandatoryskill,
      skill,
      location,

    });
    return res.status(200).json({ message: "new job created", newJob });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { jobId, title, qualification, gender, skill, location } = req.body;
    const response = await JobForm.find({ _id: jobId });
    if (response) {
      if (!title || !qualification || !gender || !skill || !location) {
        return res.status(400).json({ message: "provide all details" });
      }
      const updatedData = {
        title,
        qualification,
        gender,
        skill,
        location,
      };
      const updatedJob = await JobForm.updateOne(
        { _id: jobId },
        { $set: updatedData }
      );

      return res.status(200).json({ message: "new job created", updatedJob });
    } else {
      res.json({
        msg: "Jobs info is invalid",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });

  }
};


const allJobs = async (req, res) => {
  try {
    const jobs = await JobForm.find();  
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }
    return res.status(200).json({ message: "Jobs fetched", jobs,  dbModel: `jobfrp,${JobForm}` });
  } catch (error) {
    console.error("Error fetching jobs:", error); // Add this
    return res.status(500).json({ message: "Server error", error: error.message, dbModel: `jobfrp,${JobForm}` }); // Add this
  }
};



const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "provide job Id" });
    }
    const deletedJob = await JobForm.findOneAndDelete({ _id: id });
    return res.json({
      msg: "Job deleted",
      deletedJob,
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" });

  }
};

const applyJob = async (req, res) => {

  try {
    const { jobId, name, email, phone,isFresher, availability } = req.body;
    const resume = req.imageUrl;
    console.log(req.body, resume)
    const job = await JobForm.findOne({ _id: jobId });
    if (!job) {
      return res.status(400).json({ message: "No job found" });
    }
    if (job) {
      if (!jobId && !name && !email && !availability && !resume) {
        return res.status(400).json({ message: "provide all details" });
      }
      const newJobApply = await JobApplyForm.create({
        jobId,
        name,
        email,
        phone,
        resume,
        isFresher,
        availability,
      })
      console.log(newJobApply)
      return res.status(200).json({ message: " job applied", newJobApply });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//This function is an asynchronous function that gets all applied jobs
const getAllAppliedJobs = async (req, res) => {
  try {
    //Log a message to the console
    //Find all JobApplyForm documents and populate the jobId field
    console.log("get all applied jobs");
    //If no jobs are found, return a 400 status code with a message
    const jobs = await JobApplyForm.find().populate("jobId");
    console.log(jobs);
    if (!jobs) {
      return res.status(400).json({ message: "No jobs applied" });
      //Otherwise, return a 200 status code with a message and the jobs
    }
    return res.status(200).json({ message: " job Queries", jobs });
    //If there is an error, return a 500 status code with a message
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {Jobdemo, addJob, allJobs, updateJob, deleteJob, applyJob, getAllAppliedJobs };
