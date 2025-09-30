import express from 'express'
import { createOrder, getOrders } from '../controllers/order.controller.js'
import auth from '../middleware/auth.js'

const orderRouter = express.Router()

// Order routes
orderRouter.post('/create-order', auth, createOrder)
orderRouter.get('/get-orders', auth, getOrders)

export default orderRouter
