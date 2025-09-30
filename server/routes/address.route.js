import express from 'express'
import { addAddress, getAddresses, updateAddress, deleteAddress } from '../controllers/address.controller.js'
import auth from '../middleware/auth.js'

const addressRouter = express.Router()

// Address routes
addressRouter.post('/add', auth, addAddress)
addressRouter.get('/get', auth, getAddresses)
addressRouter.put('/update', auth, updateAddress)
addressRouter.delete('/delete', auth, deleteAddress)

export default addressRouter
