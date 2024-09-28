const postRoute = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/user")

// create a post
postRoute.post("/",async (req,res)=>{
    try{
        const postObj = new Post(req.body)
        const post = await postObj.save()
        res.status(200).json({post})
    }catch(err){
        res.status(403).json({"msg":"error"})
    }
})

// update a post
postRoute.put("/:id",async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne(req.body)
            res.status(200).json({"msg":"post has been updated"})
        }else{
            res.status(403).json({"msg":"you can only update your post"})
        }
    }catch(err){
        res.status(404).json({"msg":"Post not found"})
    }
})

// delete a post
postRoute.delete("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if( post.userId === req.body.userId ){
            const deletePost = await Post.findByIdAndDelete(req.params.id)
            res.status(200).json({"msg":"post has been deleted"})
        }else{
            res.status(403).json({"msg":"you can not delete this post"})
        }
    }catch(err){
        res.status(404).json({"msg":"Post Not found"})
    }
})

// get a post
postRoute.get("/:id",async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json({post})
    }catch(err){
        res.status(200).json({"msg":"post not found"})
    }
})

// like a post
postRoute.put("/:id/like",async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{ likes : req.body.userId}})
            res.status(200).json({"msg":"post has been liked"})
        }else{
            await post.updateOne({$pull : { likes : req.body.userId}})
            res.status(200).json({"msg":"post has been disliked"})
        }
    }catch(err){
        res.status(400).json({"msg":"Post is not found"})
    }
})

// get timeline posts
postRoute.get("/:id/timeline", async (req,res) => {
    try{
        const currentUser = await User.findById(req.params.id)
        const posts = await Post.find({userId:req.params.id})
        const friendPost  = currentUser.followings.map( friendId => {
            return Post.find({userId:friendId})
        })
        const friendPosts = await Promise.all(friendPost)
        res.status(200).json({posts:posts.concat(...friendPosts)})
    }catch(err){
        res.status(400).json({"msg":"error"})
    }
})

module.exports = postRoute