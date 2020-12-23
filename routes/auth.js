const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../key')
const requiredLogin = require('../middleware/requiredLogin')

router.get("/", requiredLogin, (req, res) => {
    res.send("hello home router")
})

router.post("/signup", (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password) {
      return  res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        // console.log(savedUser)
        if(savedUser){
          return  res.status(422).json({error: "user is allredy exist"})
        }
        bcrypt.hash(password, 12)
        .then(bcryptpassord => {
            const user = new User({
                email,
                password: bcryptpassord,
                name
            })
            user.save()
            .then(user => {
                res.json({message: "saved successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post("/signin", (req, res) => {
    const { email, password} = req.body
    if(!email || !password) {
        return res.status(422).json({error: "Invaild email and password"})
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({error: "Invaild email and password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch) {
                // res.json({message: "Sign in successfully"})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                res.json({token})
            }else{
                return res.status(422).json({error: "Invail email and password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router
