import React from 'react'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees'
import pricewithDiscount from '../utils/PriceWithDiscount'
import { useGlobalContext } from '../provider/GlobalProvider'
import { useDispatch, useSelector } from 'react-redux'
import { handleAddItemCart, decreaseQty, increaseQty, removeItemFromCart } from '../store/cartProduct' // Added removeItemFromCart

const DisplayCartItem = ({ data }) => {
    // More robust check for data and data.productId
    if (!data || !data.productId || typeof data.productId !== 'object') {
        console.warn("DisplayCartItem received invalid or incomplete data:", data);
        return null; // Don't render if data or productId is invalid
    }

    // Destructure productId for easier access and clarity
    const { name, _id, image, unit, price, discount } = data.productId;

    const url = `/product/${valideURLConvert(name)}-${_id}` // Use destructured name and _id
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const dispatch = useDispatch()

    // Get the current quantity from the Redux store
    const cartItem = useSelector(state => state.cartItem.cart);
    const currentItem = cartItem.find(item => item._id === data._id);
    const currentQuantity = currentItem ? currentItem.quantity : data.quantity; // Fallback to prop if not found (shouldn't happen if cart is loaded)


    const handleIncreaseQty = async (id, qty) => {
        await updateCartItem(id, qty + 1)
        // After updating on backend, refetch cart to update Redux store
        // fetchCartItem(); // This is already called by updateCartItem if successful, so it's redundant here.
    }
    const handleDecreaseQty = async (id, qty) => {
        await updateCartItem(id, qty - 1)
        // After updating on backend, refetch cart to update Redux store
        // fetchCartItem(); // This is already called by updateCartItem if successful, so it's redundant here.
    }
    const handleDeleteCartItem = async (id) => {
        await deleteCartItem(id)
        // After deleting on backend, refetch cart to update Redux store
        // fetchCartItem(); // This is already called by deleteCartItem if successful, so it's redundant here.
        // Also dispatch to remove from Redux store immediately for better UX
        dispatch(removeItemFromCart(id));
    }

    return (
        <div className='bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 mb-4'>
            <div className='w-24 h-24 rounded overflow-hidden'>
                <img src={image[0]} alt={name} className='w-full h-full object-cover' /> {/* Use destructured image and name */}
            </div>
            <div className='flex-1'>
                <Link to={url} className='font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1'>
                    {name} {/* Use destructured name */}
                </Link>
                <p className='text-gray-500 text-sm'>{unit}</p> {/* Use destructured unit */}
                <div className='flex items-center gap-2 mt-1'>
                    <span className='font-bold text-green-600'>{DisplayPriceInRupees(pricewithDiscount(price, discount))}</span> {/* Use destructured price and discount */}
                    <span className='text-gray-400 line-through'>{DisplayPriceInRupees(price)}</span> {/* Use destructured price */}
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <button
                    className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors'
                    onClick={() => handleDecreaseQty(data._id, currentQuantity)} // Use currentQuantity
                >
                    -
                </button>
                <span className='font-semibold text-lg'>{currentQuantity}</span>
                <button
                    className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors'
                    onClick={() => handleIncreaseQty(data._id, currentQuantity)} // Use currentQuantity
                >
                    +
                </button>
                {/* Add a delete button for each item */}
                <button
                    className='bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors'
                    onClick={() => handleDeleteCartItem(data._id)} // Use data._id
                >
                    X
                </button>
            </div>
        </div>
    )
}

export default DisplayCartItem