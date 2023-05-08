
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
                return;
            }
    // console.log(token)
            const UserDetails = await jwt.verify(token, process.env.JWT_SECRERT_KEY)
       
            const id = UserDetails.id
          
            req.user = await UserModel.findById(id).select("-password");
   
            if(!req.user){
                res.status(404).json('user not found');
                return;
            }
            next()
        } catch (e) {
            res.status(401).json('Invalid access token');
            console.log(e);
        }

    }
    
}





module.exports = checkuserAuth