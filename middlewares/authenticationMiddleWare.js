const jwt = require("jsonwebtoken");
const {User} = require("./../model/User");

async function authenticateUser(req, res, next) {
  // ? using json web token authenticate the user.
  const { jwttoken } = req.headers;
  if (!jwttoken) {
    return res.status(401).send({ message: "redirect to login page" });
  }
  try {
    
    const { email } = jwt.verify(jwttoken, process.env.privateKey);

    if (email) {
      const { firstname, lastname, _id } = await User.findOne({ email: email });
      req.email = email;
      req._id = _id;


      next();
    } else {
      return res.status(401).send({
        message: "unauthorized jsonwebtoken not matched. please re-login",
      });
    }
    
  } catch (e) {
    console.log(e.message);
    res.status(401).send({ message: e.message });
  }
}

module.exports = {
  authenticateUser,
};
