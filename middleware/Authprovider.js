

const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.js");

const secretKey = "YOUR_SECRET_KEY";

const isAuthenticate = async (req, resp, next) => {
  try {
    // take the data from the headers in token variable
    const token = req.headers.authorization.split(" ")[1];  
    if (!token) {
      return resp.status(400).json({
        status: 400,
        success: false,
        message: "Unauthorized user. Token unavailable.",
      });
    }

    // Verify the token with secret key which we used in generating token in userModel page
    console.log("before decode Token", token);
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded Token:", decoded);
    
    // You can access the decoded payload

    // console.log("Decoded Token:", decoded);

    const admin = await Admin.findOne({ _id: decoded._id }).select("email name phone role");

    if (!admin) throw new Error("user unavailable");
    //    sending below data to the req and capture it in isVarify function 
    req.token = token;
    req.user = admin;
    req.userId = admin._id;

    // console.log('>>>>>>>>>>>', req.user)

    // Proceed with the next middleware or route handler
    next();
  } catch (error) {
    console.error("from Header auth JWT Verification Error:", error);
    resp.status(401).send({
      status: 401,
      success: false,
      message: "Unauthorized",
    });
  }
};


const authorizedRole = (...roles) => {
    return (req, res, next) => {
      // Make sure req.user exists and has a role property
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Unauthorized: No user or role found in request"
        });
      }
  
      // Check if the user's role is included in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Role ${req.user.role} is not allowed to access this resource`
        });
      }
  
      // User is authorized, proceed to the next middleware or route handler
      next();
    };
  };

module.exports =  {
    isAuthenticate,
    authorizedRole
};
