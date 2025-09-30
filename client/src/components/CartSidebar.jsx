import React from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import DisplayCartItem from './DisplayCartItem';
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
    const cartItem = useSelector(state => state.cartItem.cart);

    const { totalPrice, totalQty } = useSelector(state => state.cartItem);

    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
            <div className='flex justify-between items-center p-4 border-b'>
                <h2 className='text-xl font-semibold'>Your Cart ({totalQty} Items)</h2>
                <button onClick={onClose} className='text-gray-600 hover:text-gray-900'>
                    <IoClose size={24} />
                </button>
            </div>
            <div className='p-4 overflow-y-auto h-[calc(100%-120px)]'> {/* Adjust height based on header/footer */}
                {
                    cartItem.length > 0 ? (
                        cartItem.map((el, index) => (
                            <DisplayCartItem key={el._id} data={el} />
                        ))
                    ) : (
                        <div className='text-center text-gray-500 mt-10'>Your cart is empty.</div>
                    )
                }
            </div>
            {
                cartItem.length > 0 && (
                    <div className='absolute bottom-0 left-0 w-full bg-white p-4 border-t shadow-md'>
                        <div className='flex justify-between items-center mb-2'>
                            <p className='text-lg font-semibold'>Total:</p>
                            <p className='text-lg font-bold text-green-600'>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                        <Link to="/checkout" onClick={onClose} className='block w-full bg-green-800 hover:bg-green-700 text-white text-center py-3 rounded-md font-semibold'>
                            Proceed to Checkout
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default CartSidebar