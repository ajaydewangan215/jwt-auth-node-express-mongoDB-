const User = require('../models/userSchema')

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let error = {firstname:'', lastname:'', email:'', phone:'', password:'', confirm_password:''}

    // Incorrect Login Details
    if(err.message === 'Incorrect Login Details'){
        error.email = err.message
        error.password = err.message
    }

    //duplicate error code
    if(err.code === 11000) {
        if(err.message.includes('email_1 dup key')){
            error.email = "email is already registered"
        }
        if(err.message.includes('phone_1 dup key')){
            error.phone = "phone is already registered"
        }
        return error
    }

    //validation errors
    if(err.message.includes('userdoc validation failed')){
        Object.values(err.errors).forEach(properties => {
            error[properties.path]=properties.message
        })
    }   
    return error 
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    try {
        const {firstname, lastname, email, gender, phone, age, password, confirm_password} = req.body
        const user = new User({firstname, lastname, email, gender, phone, age, password, confirm_password})
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('jwt', token, {
            maxAge: 1000 * 24 * 3 * 60 *60,
            httpOnly:true
        })
        return res.status(201).json({user})
    } catch (error) {
       const errors = handleErrors(error)
       return res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body
    try {
       const user = await User.login(email, password)
       const token = await user.generateAuthToken()
        res.cookie('jwt', token, {
            maxAge: 1000 * 24 * 3 * 60 *60,
            httpOnly:true
        })
       return res.status(200).json({user})
    } catch (error) {
       const errors = handleErrors(error)
       return res.status(400).json({errors})
    }
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/login')
}