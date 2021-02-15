const router = require('express').Router()

const User = require('../models/user')

router.route('/add').post(async (req, res) => {
    try {
        const { FirstName, LastName, Email, ContractAddress } = req.body

        const newUser = new User({
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            ContractAddress: ContractAddress
        })
        await newUser.save()

        res.send(newUser)
    }
    catch (error) {
        res.status(409).json({
            error: true,
            message: error
        })
    }
})

router.route('/receive').get(async (req, res) => {
    try {
        const users = await User.find({
            "createdAt": {
                $lte: new Date(Date.now() - 2 * 60 * 1000)  // 2 * 60 => 2 minutes
            },
            "Reminded":"false"
        })

        res.send(users)
    }
    catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
})

module.exports = router