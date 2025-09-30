import React, { useEffect } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector, useDispatch } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import Axios from 'axios'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../store/productSlice'
import { useNavigate } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

  



function Home() {
    const navigate = useNavigate()
      const dispatch = useDispatch()
   const loadingCategory = useSelector(state => state.product.loadingCategory)
    const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)

  const handleRedirectProductListpage = (id, cat) => {
    // Find the first subcategory for this category
    const sub = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    );
    if (!sub) {
      alert('No subcategory found for this category');
      return;
    }
    const url = `/category/${valideURLConvert(cat)}-${id}/${valideURLConvert(sub.name)}-${sub._id}`;
    navigate(url);
  }

    useEffect(()=>{
      const fetchCategory = async()=>{
        try {
            dispatch(setLoadingCategory(true))
            const response = await Axios(SummaryApi.getCategory)
            const { data : responseData } = response
            console.log(responseData)
            if(responseData.success){
                dispatch(setAllCategory(responseData.data));
            }
        } catch (error) {
            
        }finally{
            dispatch(setLoadingCategory(false))
        }
    }

    const fetchSubCategory = async()=>{
        try {
            const response = await Axios({
              ...SummaryApi.getSubCategory
            })
            const { data : responseData } = response

            if(responseData.success){
              dispatch(setAllSubCategory(responseData.data));
            }
        } catch (error) {
           
        } 
      }

      if(categoryData.length === 0){
        fetchCategory()
      }

      if(subCategoryData.length === 0){
        fetchSubCategory()
      }
    },[])


  return (
     <section className='bg-white'>
      <div className='container mx-auto'>
          <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2" } `}>
              <img
                src={banner}
                className='w-full h-full hidden lg:block'
                alt='banner' 
              />
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden'
                alt='banner' 
              />
          </div>
      </div>
      
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div>
                        <img 
                          src={cat.image}
                          className='w-full h-full object-scale-down'
                        />
                    </div>
                  </div>
                )
              })
              
            )
          }
      </div>

     
       {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }


   </section>
  )
}

export default Home