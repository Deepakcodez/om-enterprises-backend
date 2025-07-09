const  Admin  = require("../models/admin.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nodeMailerSender, twilioSender } = require("../utils/credential.sender.js");

// Create a new user
const createAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = new Admin({
      name,
      email,
      phone,
      password: hashedPassword,
      role:'user'
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { _id: admin._id, email: admin.email },
      "YOUR_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(200).json({ message: "Login successful",role:admin.role, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

async function otpGenerate(req, res) {
  const { payload } = req.body; // Destructure payload from request body
  console.log("-->", payload.email);

  try {
    if (!payload) {
      return res.status(400).json({ message: "Provide phone or email" });
    }

    // Check if payload is an email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(payload.email); // Simple email regex
    console.log("isEmail:", isEmail);
    if (isEmail) {
      const admin = await Admin.findOne({ email: payload.email });
      if (!admin) return res.status(400).json({ message: "Admin not found" });
      await nodeMailerSender(admin, admin.email, "OTP", `Otp:`);
      return res.json({ message: "Mail is sent successfully" });
    } else {
      const admin = await Admin.findOne({ phone: Number(payload.phone) });
      if (!admin) return res.status(400).json({ message: "Admin not found" });
      await twilioSender(admin);
      return res.json({ message: "OTP is sent successfully" });
    }
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function otpValidation(req, res) {
  const { otp } = req.body;

  console.log("Received OTP:", otp);

  try {
    // Find admin by OTP
    const admin = await Admin.findOne({ otp });

    console.log("Admin Found:", admin);

    if (!admin) {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "YOUR_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Remove OTP after validation
    admin.otp = undefined;
    await admin.save();

    return res
      .status(200)
      .json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("OTP Validation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const validateUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "authorized", user });
  } catch (error) {
    return res.status(400).json({ message: "server error" });
  }
};



const updatePassword = async (req, res) => {
  try {
    const { prevPassword, newPassword } = req.body;
    const { _id } = req.user;

    const response = await Admin.findOne({ _id: _id });
    console.log(response);

    const bcryptCheck = await bcrypt.compare(prevPassword, response.password);
    console.log(bcryptCheck, "bcrypt");
    if (bcryptCheck) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const passwordCheck = await bcrypt.compare(
        newPassword,
        response.password
      );
      if (!passwordCheck) {
        await Admin.updateOne(
          { _id: _id },
          { $set: { password: hashedPassword } }
        );
        return res.status(200).json({
          data: { msg: "Password is Updated Successfully" }
        });
      }
      return res.status(402).json({
        msg: "You're previos and new passsword is same"
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      data: { msg: "Unexpected Error" }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { _id } = req.user;

    const admin = await Admin.findOne({ _id });
    const passwordCheck = await bcrypt.compare(newPassword, admin.password);
    if (passwordCheck) {
      return res.status(402).json({
        msg: "You're previos and new passsword is same"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Admin.updateOne({ _id }, { $set: { password: hashedPassword } });

    return res.status(200).json({
      data: { msg: "Password is Updated" }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: { msg: "Unexpected Error" }
    });
  }
};

const updateAdminDetails = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { _id } = req.user;
    const response = await Admin.findOne({ _id });
    if (!response)
      return res.status(404).json({
        data: { msg: "Admin not found" }
      });

    await Admin.updateOne(
      { _id },
      {
        $set: {
          name: name || response.name,
          email: email || response.email,
          phone: phone || response.phone
        }
      }
    );
    return res.status(200).json({
      data: { msg: "Admin Details is Updated" }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: { msg: "Unexpected Error" }
    });
  }
};

module.exports =  {
  adminLogin,
  createAdmin,
  otpValidation,
  otpGenerate,
  validateUser,
  changePassword,
  updatePassword,
  updateAdminDetails
};
