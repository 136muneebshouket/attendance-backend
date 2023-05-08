const jwt = require("jsonwebtoken")
const UserModel = require("../models/usermodel")


var checkuserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers

    if (authorization && authorization.startsWith("Bearer")) {
        try {

            token = authorization.split(' ')[1]
            if (!token) {
                res.status(401).json('Access token not provided');
            }
            const UserDetails = jwt.verify(token, process.env.JWT_SECRERT_KEY)
           
            const {userID} = UserDetails
            req.user = await UserModel.findById(userID).select("-password");
            
            next()
        } catch (e) {
            res.status(401).json('Invalid access token');
            console.log(e);
        }

    }
    
}





module.exports = checkuserAuth