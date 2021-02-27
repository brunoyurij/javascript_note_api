import express from 'express'

import path from 'path'

import logger from 'morgan'

import cors from 'cors'

import usersRouter from './app/routes/users.js'

import notesRouter from './app/routes/notes.js'

import './config/database.js'

const app = express()

app.use(logger('dev'))

app.use(express.json())

// app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
    )
    next()
})

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(path.resolve(), 'public')))

app.use('/users', usersRouter)

app.use('/notes', notesRouter)

export default app
