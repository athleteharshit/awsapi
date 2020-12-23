const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../key')
const mongoose = require('mongoose')
const User = mongoose.model('User')


module.exports = (req, res, next) => {
    const {authorization} = req.headers
    // console.log(authorization)
    if(!authorization) {
        return res.status(401).json({error: "you must be logged in"})
    }

    const token = authorization.replace("Bearer ", "")
    // console.log(token)
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if(err) {
            return res.status(401).json({error: "you must be logged in"})
        }

        const {_id} = payload
        // console.log(payload)
        User.findById(_id).then(userdata => {
            req.user = userdata
            // console.log(req.user)
            next()
        })
    })
}