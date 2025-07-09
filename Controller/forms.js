const { footerForm } = require("../models/footerFormModel.js");

async function footerFormPost(req, res) {
  const { name, email, subject, message } = req.body;
  try {
    const form = new footerForm({ name, email, subject, message });
    const result = await form.save();
    if (!result) {
      return res.status(400).json({
        msg: "Unsuccessfully sent"
      });
    }
    return res.status(200).json({
      msg: "Successfully sent"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Unsuccessfully sent"
    });
  }
}
async function footerFormGet(req, res) {
  try {
    const footerFormResp = await footerForm.find();
    if (result) {
      return res.status(200).json({
        msg: "footer form get successfully",
        data: footerFormResp
      });
    } else {
      return res.status(400).json({
        msg: "Unsuccessfully sent"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server error"
    });
  }
}

module.exports ={ footerFormPost, footerFormGet };
