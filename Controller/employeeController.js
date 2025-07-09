const Employee = require("../models/employee.js") ;

 async function employeeController(req, res) {
  try {
    const { name, designation, email, phone } = req.body;
    const imageUrl = req.imageUrl;
    if (!name || !designation || !email || !phone) {
      return res.json({
        msg: "Please fill all the fields",
      });
    }
    const newTeammate = new Employee({
      name,
      designation,
      email,
      phone,
      image: imageUrl, // Save the Cloudinary URL
    });

    await newTeammate.save();
    res.status(201).json(newTeammate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating teammate" });
  }
}

 async function allEmployees(req, res) {
  try {
    const result = await Employee.find();
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({
      msg: "Unexpected Error",
    });
  }
}
 async function deleteEmployee(req, res) {
  try {

    const { id } = req.params;
    if(!id) {
      return res.status(400).json({
        msg: "Privide Id of the employee",
        status: false 
      })
    }
    const  deletedEmp = await Employee.findByIdAndDelete(id);
    if(!deletedEmp) {
      return res.status(400).json({ 
        msg: "Employee not found",
        status: false 
      })
    }
    res.status(200).json({
      msg: "Employee deleted successfully",
      status: true
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Unexpected Error",
    });
  }
}

 async function updateEmployee(req, res) {
    const { name, designation, phone, email ,  } = req.body;
    const { id } = req.params;
    console.log(req.body);
  
    try {
      const employee = await Employee.findOne({ _id: id });
      if (!employee) {
        return res.status(404).json({ msg: "Employee not found" });
      }
  
      // Update the employee details
      employee.name = name || "xxxx";
      employee.image =  employee.image;
      employee.designation = designation || employee.designation;
      employee.phone = phone || employee.phone;
      employee.email = email || employee.email;
  
      await employee.save();
  
      res.status(200).json({ msg: "Employee updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Unexpected Error" });
    }
  }

  
  module.exports = {
    employeeController,
    updateEmployee,
    deleteEmployee,
    allEmployees,
  }