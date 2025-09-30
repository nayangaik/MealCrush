import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import Loading from '../components/Loading'
import pricewithDiscount from '../utils/PriceWithDiscount'


const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const addressList = useSelector(state => state.address.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  // Check if user is logged in
  useEffect(() => {
    if (!user || !user._id) {
      toast.error("Please login to continue")
      navigate('/login')
    }
  }, [user, navigate])

  // Check if cart is empty and redirect
  useEffect(() => {
    if (!cartItemsList || cartItemsList.length === 0) {
      toast.error("Your cart is empty")
      navigate('/')
    }
  }, [cartItemsList, navigate])

  // Check if no addresses available
  useEffect(() => {
    if (addressList && addressList.length === 0) {
      toast.error("Please add an address to continue")
    }
  }, [addressList])

  const handlePlaceOrder = async (paymentMethod) => {
    if (!addressList || addressList.length === 0) {
      toast.error("Please add an address first");
      return;
    }

    if (!addressList[selectAddress]) {
      toast.error("Please select an address");
      return;
    }

    const orderPayload = {
      list_items: cartItemsList.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: pricewithDiscount(item.productId.price, item.productId.discount)
      })),
      addressId: addressList[selectAddress]?._id,
      subTotalAmt: totalPrice,
      totalAmt: totalPrice,
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE'
    };

    const loadingStateSetter = paymentMethod === 'cod' ? setLoading : setPaymentLoading;
    loadingStateSetter(true);

    try {
      const response = await Axios({
        ...SummaryApi.createOrder, // Use the new createOrder endpoint
        data: orderPayload,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (paymentMethod === 'cod') {
          toast.success(responseData.message);
          if (fetchCartItem) {
            fetchCartItem();
          }
          if (fetchOrder) {
            fetchOrder();
          }
          navigate('/success', {
            state: {
              text: "Order"
            },
            replace: true
          });
        } else if (paymentMethod === 'online' && responseData.id) {
          const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
          if (!stripePublicKey) {
            toast.error("Stripe configuration error");
            return;
          }

          const stripePromise = await loadStripe(stripePublicKey);
          const result = await stripePromise.redirectToCheckout({ sessionId: responseData.id });

          if (result.error) {
            toast.error(result.error.message);
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      } else {
        toast.error(responseData.message || "An unexpected error occurred");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      loadingStateSetter(false);
    }
  };

  const handleCashOnDelivery = () => handlePlaceOrder('cod');
  const handleOnlinePayment = () => handlePlaceOrder('online');

  // Show loading if user is not authenticated or cart is empty
  if (!user || !user._id || !cartItemsList || cartItemsList.length === 0) {
    return <Loading />
  }

  return (
    <section className='bg-blue-50 min-h-screen'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold mb-4'>Choose your address</h3>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            {
              addressList && addressList.length > 0 ? (
                addressList.map((address, index) => {
                  if (!address.status) return null
                  
                  return (
                    <label 
                      key={address._id || index} 
                      htmlFor={`address-${index}`} 
                      className="block cursor-pointer"
                    >
                      <div className={`border rounded p-3 flex gap-3 hover:bg-blue-50 transition-colors ${
                        selectAddress === index ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start">
                          <input 
                            id={`address-${index}`} 
                            type='radio' 
                            value={index} 
                            checked={selectAddress === index}
                            onChange={(e) => setSelectAddress(parseInt(e.target.value))} 
                            name='address'
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{address.address_line}</p>
                          <p className="text-gray-600">{address.city}, {address.state}</p>
                          <p className="text-gray-600">{address.country} - {address.pincode}</p>
                          <p className="text-gray-600">Mobile: {address.mobile}</p>
                        </div>
                      </div>
                    </label>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No addresses found</p>
                </div>
              )
            }
            <div 
              onClick={() => setOpenAddress(true)} 
              className='h-16 bg-blue-50 border-2 border-dashed border-blue-300 rounded flex justify-center items-center cursor-pointer hover:bg-blue-100 transition-colors mt-4'
            >
              <span className="text-blue-600 font-medium">+ Add new address</span>
            </div>
          </div>
        </div>

        <div className='w-full max-w-md bg-white rounded-lg shadow-sm p-6'>
          {/**summary**/}
          <h3 className='text-lg font-semibold mb-4'>Order Summary</h3>
          <div className='space-y-3 mb-6'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Items total</span>
              <div className='flex items-center gap-2'>
                <span className='line-through text-gray-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span className='font-medium'>{DisplayPriceInRupees(totalPrice)}</span>
              </div>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Quantity</span>
              <span className='font-medium'>{totalQty} item{totalQty > 1 ? 's' : ''}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Delivery Charge</span>
              <span className='text-green-600 font-medium'>Free</span>
            </div>
            <hr className='my-3' />
            <div className='flex justify-between text-lg font-bold'>
              <span>Grand Total</span>
              <span className='text-green-600'>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>
          
          <div className='space-y-3'>
            <button 
              className='w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded text-white font-semibold transition-colors flex items-center justify-center gap-2' 
              onClick={handleOnlinePayment}
              disabled={paymentLoading || loading || !addressList || addressList.length === 0}
            >
              {paymentLoading ? (
                <>
                  <Loading />
                  Processing...
                </>
              ) : (
                'Online Payment'
              )}
            </button>

            <button 
              className='w-full py-3 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center gap-2' 
              onClick={handleCashOnDelivery}
              disabled={loading || paymentLoading || !addressList || addressList.length === 0}
            >
              {loading ? (
                <>
                  <Loading />
                  Processing...
                </>
              ) : (
                'Cash on Delivery'
              )}
            </button>
          </div>
        </div>
      </div>


      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
    </section>
  )
}

export default CheckoutPage