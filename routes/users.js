const userRoute = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

// update 
userRoute.put("/:id", async (req,res)=>{
    if(req.params.id === req.body.id){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)
                req.body.password = hashedPassword
            }catch(err){
                res.status(500).json({"msg":"server error"})
            }
        }
        try{
            await User.findByIdAndUpdate(req.body.id,req.body)
            res.status(200).json({"msg":"Account has been updated"})
        }catch(err){
            res.status(404).json({"msg":"user not found"})
        }
    }else{
        res.status(403).json({"msg":"you can't update"})
    }
})


// delete User
userRoute.delete("/:id",async (req,res) => {
    try{
        if(req.body.id !== req.params.id) return res.status(403).json({"msg":"you can't delete this user"})
        await User.findByIdAndDelete(req.body.id)
        res.status(200).json({"msg":"user deleted"})
    }catch(err){
        res.status(404).json({"msg":"User doesn't exists"})
    }
})

// get a user
userRoute.get("/:id", async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password,updatedAt,...other} = user._doc
        res.status(200).json({"user":other})
    }catch(err){
        res.status(404).json({"msg":"Id is not valid"})
    }
})

// follow a user
userRoute.post("/:id/follow", async (req,res) => {
    if(req.params.id !== req.body.id){
        try{
            const currentUser = await User.findById(req.body.id)
            const user = await User.findById(req.params.id)
            if(user.followers.includes(currentUser._id)) return res.status(403).json({"msg":"you already follow"})
            await user.updateOne({$push:{ followers : currentUser._id }})
            await currentUser.updateOne({$push : { followings: user._id }})
            res.status(200).json({"msg":"user is followed"})
        }catch(err){
            res.status(404).json({"msg":"Either user or followed user doen't exits"})
        }
    }else{
        res.status(403).json({"msg":"you can't follow yourself"})
    }
})

// unfollow a user
userRoute.post("/:id/unfollow",async (req,res) => {
    if(req.params.id !== req.body.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.id)
            if(user.followers.includes(currentUser._id)){
                await user.updateOne({$pull:{ followers : currentUser._id }})
                await currentUser.updateOne({$pull:{ followings : user._id }})
                res.status(200).json({"msg":"user is unfollwed"})
            }else{
                res.status(403).json({"msg":"you can't unfollow"})
            }
        }catch(err){
            res.status(403).json({"msg":"Either user or follower user doen't exits or server error"})
        }
    }else{
        res.status(403).json({"msg":"you can't unfollow youself"})
    }
})

module.exports = userRoute