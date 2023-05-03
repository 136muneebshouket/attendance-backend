const mongoose = require("mongoose");


const EmployeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,

    },

    father_name: {
        type: String,
        required: true,
    },
    cnic: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,

    },
    dob: {
        type: String,
    },
    role: {
        role_title: {
            type: String
        },
        role_desc: {
            type: String
        }
    },
    checkin: {
        type: String
    },
    checkout: {
        type: String
    }




})

const EmployeeModel = mongoose.model("employee", EmployeeSchema);

module.exports = EmployeeModel;