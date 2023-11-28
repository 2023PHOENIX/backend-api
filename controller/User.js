const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

function registerNewUser(req, res) {
    const {firstname, lastname, email, password} = req.body;
    // ? use bcrypt to get the encrypted password.
    bcrypt.hash(password, 10, function (err, hashedPassword) {
        // * returning hashed password can store in DB.
        // ! also get the _id which can be used in jwt token
        const newUser = new User({firstname, lastname, email, password: hashedPassword});

        newUser.save().then(() => {
            return res.status(200).send({message: "saved successfully"})
        }).catch(e => {
            return res.status(401).send({message: e.message});
        });
    })
}


async function loginUser(req, res) {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(401).json({message: "user not found"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        const token = await jwt.sign({email}, process.env.privateKey, {expiresIn: '1h'});
        return res.status(200).json({message: "successfully logged in", "jwttoken": token});
    } else {
        return res.status(401).send({message: "password was incorrect"});
    }
}

module.exports = {
    registerNewUser,
    loginUser
}