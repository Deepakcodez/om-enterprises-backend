const otp = require("otp-generator");
const { Admin } = require("../models/admin.js");

async function otpGenerator() {
	const otpInfo = otp.generate(4, {
	  digits: true,
	  upperCaseAlphabets: false,
	  lowerCaseAlphabets:false,
	  specialChars: false,
	});
  
	// const otpItem = new Admin({ otp: otpInfo });
	// const response = await otpItem.save();
	// console.log(response);
  
	return otpInfo;
  }

  
  module.exports  = { 
	otpGenerator
  }