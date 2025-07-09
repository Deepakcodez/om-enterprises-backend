const Plan = require("../models/plan.js");

const addPlan = async (req, res) => {
    const { title, price, descriptions, category } = req.body;
    console.log("data", req.body);

    try {
        if (!title || !price || !descriptions || !category) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        const newPlan = await Plan.create({ title, category, price, descriptions });
        return res.status(200).json({ message: "new plan created successfully", plan: newPlan })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};


const getPlan = async (req, res) => {
    try {
        const { category } = req.params
        console.log(category)
        const allPlans = await Plan.find({ category })
        if (allPlans) {
            return res.status(200).json({
                msg: "Successfully done",
                plans: allPlans
            })
        }
        return res.status(402).json({
            msg: "No such category present"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Unexpected Error",
        })
    }
}


const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Plan.findOne({ _id: id })
        console.log(response)

        if (!response) {
            return res.status(400).json({   
                msg: "Plan is not available"
            })
        }
        const planDeleted = await Plan.deleteOne({ _id: id })
        if(!planDeleted)    {
            return res.status(400).json({
                msg: "Plan is not deleted"
            })
        }

        return res.status(200).json({
            msg: "plan deleted successfully",
            deletedPlan : planDeleted
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Unexpected Error"
        })
    }
}


const updatePlan = async (req, res) => {
    try {
        const { id } = req.params
        const { title, category, price, descriptions } = req.body

        const response = await Plan.findOne({ _id: id })

        if (!response) {
            return res.status(402).json({
                msg: "Plan is not present"
            })
        }

        const updateObj = {
            title: title || response.title,
            category: category || response.category,
            price: price || response.price,
            descriptions: descriptions || response.descriptions
        }

        const result = await Plan.updateOne(
            { _id: id },
            { $set: updateObj }
        )

        if(!result){
            return res.status(200).json({
            msg:"Provided data is already exist"


            })
        }

        return res.status(200).json({
                msg:"Successfully Updated"
        })

    } catch (error) {
        console.log(error)
        return res.status(402).json({
            msg: "Unexpected Error"
        })
    }
}



module.exports = {
    addPlan,
    getPlan,
    deletePlan,
    updatePlan
}