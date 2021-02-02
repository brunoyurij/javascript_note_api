import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
})

userSchema.pre('save', function preSave(next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashedPassword) => {
            if (err) {
                next(err)
            } else {
                this.password = hashedPassword
                next()
            }
        })
    }
})

export default mongoose.model('User', userSchema)
