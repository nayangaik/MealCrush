import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;