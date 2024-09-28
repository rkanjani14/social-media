const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

router.post("/registration", async (req,res) => {
    try{
        const alreadyUser = await User.findOne({email:req.body.email})
        if(alreadyUser ) return res.status(403).json({"msg":"user already register"})
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword
        await User.create(req.body)
        res.status(200).json({"msg":"user created"})
    }catch(err){
        res.status(400).json({"msg":"Fill the registration form"})
    }
})

router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user) return res.status(404).json({"msg":"user not found"})
        const matchPassword = await bcrypt.compare(req.body.password,user.password)
        if(!matchPassword) return res.status(403).json({"msg":"Incorrect Password"})
        res.status(200).json({"msg":"LoggedIn Successfully"})
    }catch(err){
        res.status(400).json({"msg":"please provide the password"})
    }
})

module.exports = router