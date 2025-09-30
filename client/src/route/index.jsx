import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategory from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import AdminPermision from "../layouts/AdminPermision";
import ProductAdmin from "../pages/ProductAdmin";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CheckoutPage from "../pages/CheckoutPage";







const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
             {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : 'login',
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "verification-otp",
                element : <OtpVerification/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMenuMobile/>
            },
             {
                path : "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                     {
                        path : "myorders",
                        element : <MyOrders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : "product",
                        element : <AdminPermision><ProductAdmin/></AdminPermision>
                    },
                    {
                        path : "category",
                        element : <AdminPermision><CategoryPage/></AdminPermision>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPermision><SubCategory/></AdminPermision>
                    }
                    ,
                    {
                        path : "upload-product",
                        element : <AdminPermision><UploadProduct/></AdminPermision>
                    }
                ]
            },
            {
                path : "category/:category/:subCategory",
                element : <ProductListPage/>
            },
            {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
                path : "checkout",
                element : <CheckoutPage/>
            },
            {
                path : "success",
                element : <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Thank you for your order. We'll process it soon.</p>
                    </div>
                </div>
            }
        ]
    }
]);

export default router;