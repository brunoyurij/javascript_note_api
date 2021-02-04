import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

dotenv.config()
const secret = process.env.JWT_TOKEN

const WithAuth = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: no token provided' })
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized: Invalid token' })
            } else {
                req.email = decoded.email
                User.findOne({ email: decoded.email })
                    .then((user) => {
                        req.user = user
                        next()
                    })
                    .catch((error) => {
                        res.status(401).json({
                            error,
                        })
                    })
            }
        })
    }
}

export default WithAuth
