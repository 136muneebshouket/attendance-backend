const router = require("express").Router();
const bcrypt = require("bcrypt");
const EmployeeModel = require("../models/EmployeeModel")

//REGISTER
router.post("/addemployee", async (req, res) => {
    try {
      const product = req.body;
      const newproduct = new EmployeeModel(product);
      await newproduct.save();
  
      res.json(newproduct);
    } catch (err) {
      res.json(err);
    }
  });
  
  //getemployee product /////////////////////////////////
  router.get("/getemployee", (request, response) => {
    EmployeeModel.find({}, (err, result) => {
      if (!err) {
        response.json(result);
      } else {
        response.json(err);
      }
    });
  });
  
  // updateemployee /////////////////////////////////////////////////////
  router.put("/updateemployee", (req, res) => {
    const { id, Name, Father_name, cnic_no, Phone, Email, avatar } = req.body;
  
    try {
        EmployeeModel.findById(id, (err, employee) => {
        // console.log(user)
        employee.Name = Name;
        // user.age = age
        employee.Father_name = Father_name;
        employee.cnic_no = cnic_no;
        employee.Phone = Phone;
        employee.Email = Email;
        employee.avatar = avatar;
  
        employee.save();
        res.send("employee has been successfully updated in DB");
      });
    } catch (err) {
      res.send("Getting error from server");
    }
  });
  
  // delete employee
  
  router.delete("/delEmployee/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await EmployeeModel.findByIdAndDelete(id);
      res.send("employee has been successfully deleted from DB")
    } catch (error) {
      res.send("failed to delete");
      console.log(error)
    }
  });
      module.exports = router