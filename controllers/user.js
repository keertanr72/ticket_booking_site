const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.postCheckEmail = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user)
        res.status(401).json(user)
    else
        res.status(200).json(user)
}

exports.postCreateUser = async (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if(err){
                console.log(err)
                res.status(500).json({success: 'fail'})
            }
            await User.create({
                userName: req.body.userName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash
            })
            res.status(201).json({ message: 'User created successfully' })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: 'something went wrong'})
    }
}

const generateToken = (userData) => {
    return jwt.sign({ userId: userData.id, email: userData.email }, 'secretKey')
}

exports.postLogin = async (req, res) => {
    try {
        const userData = await User.findAll({ where: { email: req.body.email } })
        bcrypt.compare(req.body.password, userData[0].password, async (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Something Went wrong' })
            }
            if (result) {
                res.status(200).json({ message: 'login successfull', token: generateToken({ id: userData[0].id, email: userData[0].email }) })
            }
            else {
                res.status(401).json({ message: 'wrong password' })
            }
        })
    } catch (error) {
        res.status(404).json({ message: 'user not present' })
        console.log(error)
    }
}