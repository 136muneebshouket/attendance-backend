const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
      // select:false
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isAdmin:{
      type:Boolean,
      required:true,
      default:false
    },
    full_name:{
      type:String,
      required:true,
    },
    avatar:{
      type:String,
      required:false,
      default:""
    },
    resetToken: {
      type:String,
      required:false,
      default:""
    },
    resetTokenExpiration: {
      type: Date,
      required:false,
     
    }
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);