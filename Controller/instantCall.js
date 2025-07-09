const  formContact  = require("../models/contactUsForm.js");
const footerForm  = require("../models/footerFormModel.js");
const  Notification  = require("../models/notification.js");

async function instantCallBackQuery(req, res) {
    const { name, email, subject, message, phone } = req.body;
    try {

        const instantCallBackResp = await footerForm.create({ name, email, subject, message, phone });
        await instantCallBackResp.save();
        if (!instantCallBackResp) {
            return res.status(400).json({
                msg: "Unsuccessfully sent",
            });
        }

        try {
            const notification = await Notification.create({
                title: "New Contact Form Submission",
                message: `A new contact form submission has been received.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\nPhone: ${phone}`,
            });

            await notification.save(); 
        } catch (notifyErr) {
            console.error("Error saving notification:", notifyErr);
        }
        return res.status(200).json({
            msg: "Successfully sent",
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Unsuccessfully sent",
        })
    }
}
async function allInstantCallBackQueries(req, res) {
    try {

        const instantCallBackQueries = await footerForm.find()
        if (!instantCallBackQueries) {
            return res.status(400).json({
                msg: "Unsuccessfully",
            });
        }
        return res.status(200).json({
            msg: "footer form get successfully",
            data: instantCallBackQueries
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Server error",

        });
    }
}

async function postContactUs(req, res) {
    const {
        name,
        email,
        phone,
        location,
        companyName,
        service,
        isDeveloper,
        message,
        hearAboutUs,
    } = req.body;
    try {
        const form = await formContact.create({
            name,
            email,
            phone,
            location,
            companyName,
            service,
            isDeveloper,
            hearAboutUs,
            message,
        })

        await form.save();
        if (!form) {
            return res.status(402).json({
                msg: "Unsuccessfully sent",
            });
        }
        const notification = await Notification.create({
            title: "New Contact Form Submission",
            message: `A new contact form submission has been received.\n\nName: ${name}\nEmail: ${email}\nSubject: ${service}\nMessage: ${message}\nPhone: ${phone}`,
        });

        await notification.save(); 
        res.status(200).json({
            msg: "Successfully sent",
        });
    } catch (error) {
        console.log(error);
    }
}


async function getAllContactQueries(req, res) {
    try {
        const result = await formContact.find();
        if (!result) {
            return res.status(402).json({
                msg: "Unsuccessfully sent",
            });
        } res.status(200).json({
            msg: "Successfully sent ",
            data: result
        });

    } catch (error) {
        console.log(error);
    }
}



module.exports ={
    instantCallBackQuery,
    allInstantCallBackQueries,
    postContactUs,
    getAllContactQueries,
}