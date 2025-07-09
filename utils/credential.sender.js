const { Admin } = require("../models/admin.js");
const { otpGenerator } = require("./helpers.js");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

async function nodeMailerSender(admin,to,subject, message) {
	const otp = await otpGenerator();
	console.log("otp genereated ", otp)
    admin.otp = otp
  await admin.save();
  console.log(otp);

  const adminDb = await Admin.find({ otp });
  console.log(adminDb);

  if (adminDb.length > 0) {
    setTimeout(async () => {
      adminDb.otp = null
   
    }, 100000);
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "deepak2603om@gmail.com",
      pass: process.env.EMAIL_SEC
    },
    
  });

  async function main() {
    const info = await transporter.sendMail({
      to:to, // recipient
      subject: subject, // Subject line
      text: message + admin?.otp, // plain text body
      // html: `Otp: ${otp}` // HTML body
    });
  }

  main().catch(console.error);
}

async function twilioSender(admin) {
  const otp = await otpGenerator();
  admin.otp = otp
  
  await admin.save();

  const adminDb = await Admin.find({ otp });
  console.log(adminDb);

  if (adminDb.length > 0) {
    setTimeout(async () => {
      adminDb.otp = null
      // adminDb.save()
    }, 100000);
  }

  const accountSid = process.env.ACCOUNTSID;
  const authToken = process.env.AUTHTOKEN;
  const client = new twilio(accountSid, authToken);
  
  async function sendSMS() {
    try {
      const message = await client.messages.create({
        body: `Do not share the OTP: ${otp}, use within 1 minute`,
        from: "+17179225895", // Your Twilio phone number
        to: "+91 7814897900",
        username: "mariah.lehner64@ethereal.email"
      });

      console.log("Message sent successfully:", message.sid);
      console.log(message);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  }

  sendSMS();
}

module.exports = { nodeMailerSender, twilioSender };
