import express from 'express'
import Note from '../models/note.js'
import withAuth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', withAuth, async (req, res) => {
    const { title, body } = req.body

    try {
        const note = new Note({ title, body, author: req.user._id })
        await note.save()
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({
            error: 'Problem to create a new note',
            msg: error,
        })
    }
})

const isOwner = (user, note) => {
    if (JSON.stringify(user._id) === JSON.stringify(note.author._id))
        return true
    return false
}

router.get('/:id', withAuth, async (req, res) => {
    try {
        const { id } = req.params
        const note = await Note.findById(id)

        if (isOwner(req.user, note)) {
            res.status(200).json(note)
        } else {
            res.status(403).json({
                erro: 'Permission denied',
            })
        }
    } catch (error) {
        res.status(500).send({ error: 'Problem to get a note', msg: error })
    }
})

router.get('/', withAuth, async (req, res) => {
    try {
        const notes = await Note.find({ author: req.user._id })

        res.status(200).json(notes)
    } catch (error) {
        res.status(500).send({ error: 'Problem to get a notes', msg: error })
    }
})

router.put('/:id', withAuth, async (req, res) => {
    const { title, body } = req.body
    const { id } = req.params

    try {
        const noteVerify = await Note.findById(id)

        if (isOwner(req.user, noteVerify)) {
            const note = await Note.findOneAndUpdate(
                id,
                {
                    $set: { title, body },
                },
                { upsert: true, new: true }
            )

            res.status(200).send(note)
        } else {
            res.status(403).json({
                erro: 'Permission denied',
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router
