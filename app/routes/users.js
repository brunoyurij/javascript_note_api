import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.js'
import withAuth from '../middlewares/auth.js'

dotenv.config()

const router = express.Router()

const secret = process.env.JWT_TOKEN

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    const user = new User({ name, email, password })

    try {
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user' })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ error: 'Incorrect email or password' })
        } else {
            user.isCorrectPassword(password, (err, same) => {
                if (!same) {
                    res.status(401).json({
                        error: 'Incorrect email or password',
                    })
                } else {
                    const token = jwt.sign({ email }, secret, {
                        expiresIn: '1d',
                    })
                    res.status(200).json({ user, token })
                }
            })
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal error, please try again' })
    }
})

router.put('/', withAuth, async (req, res) => {
    const { name, email } = req.body

    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: { name, email } },
            { upsert: true, new: true }
        )

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put('/password', withAuth, async (req, res) => {
    const { password } = req.body

    try {
        const user = await User.findOne({ _id: req.user.id })

        user.password = password
        await user.save()

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/', withAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })

        await user.delete()

        res.json({ message: 'OK' }).status(201)
    } catch (err) {
        res.status(500).json(err)
    }
})

export default router
