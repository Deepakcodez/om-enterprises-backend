const  Notification  = require("../models/notification.js")

const getAllNotification = async (req, res) => {
    try {
        const notification = await Notification.find()
        if (!notification) {
            return res.status(400).json({
                msg: "No notification found"
            })
        }
        return res.status(200).json({
            msg: "Successfully done",
            notification: notification
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"


        })
    }

}


module.exports=  { getAllNotification }