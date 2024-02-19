import express from 'express'
import { getUser, getUsers, deleteUser, updateUser, addUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/', addUser)

export const userRoutes = router