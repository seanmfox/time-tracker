require("dotenv").load();
const jwt = require("jsonwebtoken");

exports.loginRequired = function(req, res, next) {
  try {
    const token = req.cookies.JWT;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if(decoded) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Please log in first."
        })
      }
    })
  } catch(e) {
    return next({
      status: 401,
      message: "Please log in first."
    })
  }
  
}

exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.cookies.JWT;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if(decoded && decoded.userId === req.params.userId) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized."
        })
      }
    })
  } catch(e) {
    return next({
      status: 401,
      message: "Unauthorized."
    })
  }

}

exports.adminOnlyData = function(req, res, next) {
  try {
    const token = req.cookies.JWT;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if(decoded.userRole === 'admin') {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized"
        })
      }
    })
  } catch (error) {
    return next({
      status: 401,
      message: "Unauthorized"
    })
    
  }
}