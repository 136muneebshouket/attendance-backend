const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose");
const UsersRoutes = require('./src/Routes/UserRoutes')
const EmployeeRoutes = require('./src/Routes/EmployeeRoute')
const Forgetpassword = require('./src/Routes/forgetpassword')
const refreshtoken=require('./src/Routes/refereshtoken')
const app = express();
require("dotenv").config()
mongoose.set('strictQuery', true)
app.use(cors())
app.use(express.json());

app.use("/api/user",UsersRoutes)
app.use("/api/employee",EmployeeRoutes)
app.use("/api/forgetpassword",Forgetpassword)
app.use("/api/refreshtoken",refreshtoken)



app.get("/", async (req, res) => {
  res.send("Attandence Mangement  Server is running")
})





app.get("/hi",(req,res)=>{
  res.render("h-i",{'name':"ali"})
})


const PORT = 4800;
mongoose.connect(process.env.MONGO_URL).then(
  console.log("Your Connection is successful")
)
app.listen(PORT, () => {
  console.log(`Attandence API is running on http://localhost:${PORT}`);
}); 