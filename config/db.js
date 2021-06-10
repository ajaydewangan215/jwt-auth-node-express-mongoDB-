const mongoose = require('mongoose')

const DB = process.env.DATABASE
mongoose.connect(`mongodb://localhost:27017/${DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>console.log("connection successfully.."))
.catch(err=>console.log(err))