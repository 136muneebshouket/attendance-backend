const jwt = require("jsonwebtoken")
const UserModel = require("../models/usermodel")


var checkuserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers

    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(' ')[1]
            const UserDetails = jwt.verify(token, process.env.JWT_SECRERT_KEY)
           
           
            const {userID} = UserDetails
            req.user = await UserModel.findById(userID).select("-password");
            
            next()
        } catch (e) {
            console.log(e);
        }

    }
    if (!token) {
        res.send("No User found")
    }
}





module.exports = checkuserAuth