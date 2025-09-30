import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import { setOrder } from '../store/orderSlice'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const dispatch = useDispatch()

  const fetchOrders = async () => {
    try {
      const response = await Axios.get('/api/get-orders')
      if (response.data.success) {
        dispatch(setOrder(response.data.data))
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  console.log("order Items",orders)
  return (
    <div className='container mx-auto p-4'>
      <div className='bg-white shadow-md p-3 font-semibold mb-4 rounded'>
        <h1 className='text-xl'>My Orders</h1>
      </div>
        {
          orders.length === 0 && (
            <NoData/>
          )
        }
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {
          orders.map((order,index)=>{
            return(
              <div key={order._id+index+"order"} className='bg-white rounded-lg shadow-md p-4 border border-gray-200'>
                  <p className='text-lg font-semibold mb-2 text-gray-800'>Order No : <span className='text-blue-600'>{order?.orderId}</span></p>
                  <div className='border-t border-gray-200 pt-2'>
                    <h3 className='text-md font-medium mb-2'>Products:</h3>
                    {
                      order.items.map((item, itemIndex) => (
                        <div key={item._id + itemIndex} className='flex items-center gap-3 mb-2 p-2 bg-gray-50 rounded-md'>
                          <img
                            src={item.productId.image[0]} 
                            className='w-16 h-16 object-cover rounded-md border border-gray-200'
                            alt={item.productId.name}
                          />  
                          <p className='font-medium text-gray-700'>{item.productId.name}</p>
                        </div>
                      ))
                    }
                  </div>
              </div>
            )
          })
        }
        </div>
    </div>
  )
}

export default MyOrders