const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require('bcrypt');
const jwt = require('jsonWebtoken')

// structure of mongoose.Schema
const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required:[true, 'Please enter an firstname'],
        minlength:[3, 'Minimum length is 3 character']
    },
    lastname: { 
        type: String, 
        required:[true, 'Please enter an lastname'],
        minlength:[3, 'Minimum length is 3 character']
    },
    email:{ 
        type: String, 
        required:[true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate: [isEmail, 'Please enter valid email address']
    },
    gender: { 
        type: String
    },
    phone: { 
        type: Number, 
        min: 10,
        required:[true, 'Please enter an phone'],
        unique:true
    },
    age: { 
        type: Number
    },
    password: { 
        type: String, 
        required:[true, 'Please enter an password'],
        minlength:[6, 'Minimum legnth is 6 character']
    },
    confirm_password: { 
        type: String, 
        required:[true, 'Please enter an confirm password'],
        minlength:[6, 'Minimum legnth is 6 character']
    },
    insdate: {
    	type: Date,
    	default: Date.now()
    }
});

// middleware create token
userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY, {
            expiresIn: 3 * 24 * 60 * 60
        })
        return token
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

// fire a function before doc is saved to db
userSchema.pre("save", async function(next) {
    console.log('post data by user', this)
    if(this.isModified("password")){       
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
        this.confirm_password = await bcrypt.hash(this.password, salt) //not need
    }
    next()
});

// fire a function after doc is saved to db
userSchema.post("save", function(doc, next) {
    console.log('new user was created & saved', doc)
    next()
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user){
      const auth = await bcrypt.compare(password, user.password)
      if(auth){        
        return user
      }
      throw Error('Incorrect Login Details')
    }
    throw Error('Incorrect Login Details')
}

//   Collection creation
const User = mongoose.model('userdoc', userSchema)
module.exports = User