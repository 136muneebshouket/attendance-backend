const router = require("express").Router();
const UserModel = require("../models/usermodel");
var jwt = require("jsonwebtoken");
const checkuserAuth = require("../middleware/auth")
const bcrypt = require("bcrypt");
const nodemailer= require("nodemailer")




//REGISTER////////////////////////////////////////////
router.post("/register", async (req, res) => {
  var { password, email, full_name, username } = req.body;
  if (password && email && full_name && username) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        username,
        password: hashedPass,
        full_name,
        email,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern.email) {
          return res.status(409).json({
            success: false,
            message: "Email Already Exist!",
          });
        } else if (err.keyPattern.username) {
          return res.status(409).json({
            success: false,
            message: "Username Already Exist!",
          });
        }
      }

      res.status(500).json(err);
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Username, Email, Full Name and Password are required",
    });
  }
});

// LOGIN//////////////////////////////////////////////
router.post("/login", async (req, resp) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });

    if (!user) {
      resp.status(404).json({
        success: false,
        message: "Invalid Username or Password",
      });
    } else {
      const validated = await bcrypt.compare(req.body.password, user.password);

      if (!validated) {
        resp.status(403).json({
          success: false,
          message: "Invalid Username or Password",
        });
      } else {
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRERT_KEY, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRERT_KEY, { expiresIn: '7d' });
        resp.status(200).json({token, refreshToken });
      }
    }
  } catch (error) {
    resp.status(404).json(error);
  }
});



// get all user
router.get("/allusers", async (req, res) => {
  try {
    const desig = req.query.desig;
    let find;
    if (desig) {
      find = await UserModel.aggregate([
        { $match: { desig } },
        { $project: { username: 1, email: 1 } },
      ]);
    } else {
      find = await UserModel.aggregate([
        { $match: {} },
        { $project: { username: 1, email: 1, photo: 1, desig: 1 } },
      ]);
    }

    if (find) {
      res.status(200).send(find);
    } else {
      res.status(404).send("There is no user");
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

// update user
router.put("/:id", async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      let resp = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          username: req.body.username,
          password: hashedPass,
          photo: req.body.photo,
        },
        { new: true }
      );
      res.json(resp);
    } else {
      let resp = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(resp);
    }
  } catch (e) {
    res.send(e);
  }
});




// Change password
router.post("/changepassword",checkuserAuth, async(req,res)=>{
  try {
  
    const {password, cpassword} =req.body
    if (password && cpassword) {
      if (password !==cpassword) {
        
        res.send("password and confirm password does not match")
        
      }else{
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password,salt)
        await UserModel.findByIdAndUpdate(req.user._id,{
          $set:{
            password:hashedPass
          }
        })
       
        res.send("password changed Succesfully ")
      }
      
    }else{
      res.send({"Status":"Wrong","Message":"Please enter all credentials"})
    }
    
  } catch (e) {
    console.log(e);
  }
  })

  
  // Logged user
  router.get("/loggeduser",checkuserAuth, async (req, res) => {
    try {
     
   res.status(200).send({"User":req.user})
    } catch (e) {
      res.status(404).send(e);
    }
  });
  






module.exports = router;
