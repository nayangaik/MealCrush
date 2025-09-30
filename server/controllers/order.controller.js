import OrderModel from '../models/order.model.js'
import CartModel from '../models/cartproduct.model.js'
import AddressModel from '../models/address.model.js'
import ProductModel from '../models/product.model.js' // Import ProductModel
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe' // Import Stripe

const stripe = Stripe(process.env.STRIPE_SECRET_KEY) // Initialize Stripe

export const createOrder = async (request, response) => {
    try {
        const { list_items, addressId, subTotalAmt, totalAmt, paymentMethod } = request.body
        const userId = request.user.id

        if (!list_items || !addressId || !subTotalAmt || !totalAmt || !paymentMethod) {
            return response.status(400).json({
                message: "Missing required fields",
                error: true,
                success: false
            })
        }

        // Verify address belongs to user
        const address = await AddressModel.findOne({ _id: addressId, userId: userId })
        if (!address) {
            return response.status(400).json({
                message: "Invalid address",
                error: true,
                success: false
            })
        }

        // Create order
        const order = new OrderModel({
            orderId: uuidv4(),
            userId: userId,
            items: list_items,
            address: address,
            subTotal: subTotalAmt,
            totalAmount: totalAmt,
            paymentMethod: paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'placed'
        })

        const savedOrder = await order.save()

        if (paymentMethod === 'COD') {
            // Clear cart after successful order
            await CartModel.deleteMany({ userId: userId })

            return response.json({
                message: "Order placed successfully",
                data: savedOrder,
                error: false,
                success: true
            })
        }

        if (paymentMethod === 'ONLINE') {
            // Integrate with Stripe
            const lineItems = await Promise.all(list_items.map(async (item) => {
                const product = await ProductModel.findById(item.productId)

                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found.`)
                }

                const sellingPrice = parseFloat(product.price)
                if (isNaN(sellingPrice)) {
                    throw new Error(`Invalid selling price for product ID ${item.productId}. Selling price found: ${product.price}`)
                }

                const productName = product.productName || `Product ID: ${item.productId}` // Fallback for missing product name

                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: Math.round(sellingPrice * 100), // amount in cents
                    },
                    quantity: item.quantity,
                }
            }))

            console.log("Stripe line items:", lineItems);
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success?orderId=${savedOrder._id}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel?orderId=${savedOrder._id}`,
                metadata: { orderId: savedOrder._id.toString() },
            });
            console.log("Stripe session created:", session);

            return response.json({
                message: "Payment session created",
                id: session.id,
                success: true,
                error: false
            })
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getOrders = async (request, response) => {
    try {
        const userId = request.user.id
        const { page = 1, limit = 10 } = request.query

        const skip = (page - 1) * limit

        const orders = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('items.productId')

        const totalOrders = await OrderModel.countDocuments({ userId: userId })

        return response.json({
            message: "Orders retrieved successfully",
            data: orders,
            totalOrders: totalOrders,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / limit),
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}