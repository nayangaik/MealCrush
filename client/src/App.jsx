import { Outlet } from 'react-router-dom'
import './index.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import {useState} from 'react';
import SummaryApi from './common/SummaryApi';
import Axios from 'axios';
import GlobalProvider from './provider/GlobalProvider';

const App = () => {
     const dispatch = useDispatch()
     const location = useLocation()
     const [loading,setLoading] = useState(false)
     const user = useSelector(state => state.user)

     const fetchUser = async()=>{
      try {
        const userData = await fetchUserDetails()
        if (userData && userData.data) {
          dispatch(setUserDetails(userData.data))
        }
      } catch (error) {
        console.log('Error fetching user details:', error)
      }
     }

  useEffect(()=>{
    // Only fetch user if not already logged in
    if (!user._id) {
      fetchUser()
    }
  },[])

    return (
      <GlobalProvider>
        <>
            <Header />
            <main className='min-h-[78vh]'>
                <Outlet />
            </main>
            <Footer />
            <Toaster />
        </>
      </GlobalProvider>
    );
};

export default App