const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.checkUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const user = jwt.verify(token, 'secretKey')
        console.log(token, 'token')
        console.log(user, user)
        await User.findByPk(user.userId)
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
}