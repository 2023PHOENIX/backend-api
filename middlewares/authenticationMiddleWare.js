const jwt = require('jsonwebtoken');
const User = require('./../model/User');

async function authenticateUser(req, res, next) {
    // ? using json web token authenticate the user.
    const {jwttoken} = req.headers
    // console.log(jwttoken);
    if (!jwttoken) {
        return res.status(401).send({message: "redirect to login page"})
    }

    const {email} = jwt.verify(jwttoken, process.env.privateKey);
    console.log(email);
    if (email) {
        const {firstname,lastname} = await User.findOne({email : email});
        return res.status(200).send({message : "user",firstname,lastname})
    } else {
        return res.status(401).send({message: "unauthorized jsonwebtoken not matched. please re-login"});
    }
}


module.exports = {
    authenticateUser,
}