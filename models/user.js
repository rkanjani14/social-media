const mongoose  = require("mongoose")
const userSchema = mongoose.Schema({
    name : { type: String, required:true},
    email : { type: String, required:true, unique:true},
    password : { type:String, required:true},
    profilePicture: { type:String, default: ""},
    coverPicture: { type:String, default: ""},
    followers : { type : Array ,default:[]},
    followings : { type: Array, default : []},
    isAdmin : { type:Boolean , default:false },
    desc: { type:String , max:50 },
    city: {
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    }

}, { timestamps : true})
const User = mongoose.model('user',userSchema)
module.exports = User
