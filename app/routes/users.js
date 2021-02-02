import express from 'express'
import User from '../models/user.js'

const router = express.Router()

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

export default router
