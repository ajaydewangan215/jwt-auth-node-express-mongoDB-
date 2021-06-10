const jwt = require('jsonWebtoken')
const User = require('../models/userSchema')

const Authenticate = async (req, res, next) => {
    const token = req.cookies.jwt
    if(!token) res.redirect('/login')
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
    if(!verifyToken) res.redirect('/login')
    next()
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodeToken) => {
            if(err) {
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodeToken._id)
                res.locals.user = user
                next()
            }
        })
    } else{
        res.locals.user = null
        next()
    }
}

module.exports = { Authenticate, checkUser }