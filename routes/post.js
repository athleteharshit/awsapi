const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middleware/requiredLogin')
const Post = mongoose.model('Post')


router.get('/allpost', (req, res) => {
    Post.find()
    .populate('postedBy', '_id name')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})


router.post('/createpost', requiredLogin, (req, res) => {
    const {title, body} = req.body
    if(!title || !body) {
        return res.status(422).json({error: "please add all the fields"})
    }
    // console.log(req.user)
    req.user.password = undefined
    const createpost = new Post({
        title,
        body,
        postedBy: req.user
    })

    createpost.save().then(result => {
        res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/mypost', requiredLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate('postedBy', '_id name')
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.logerr
    })
})

module.exports = router