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

app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(path.resolve(), 'public')))

app.use('/users', usersRouter)

app.use('/notes', notesRouter)

export default app
