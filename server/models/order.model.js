import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    address: {
        address_line: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        }
    },
    subTotal: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    trackingId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

const OrderModel = mongoose.model('Order', orderSchema)

export default OrderModel