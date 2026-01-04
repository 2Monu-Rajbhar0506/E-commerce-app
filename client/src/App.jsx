import { useEffect } from "react";
import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice.js";
import SummaryApi from "./common/summaryApi.js";
import api from "./utils/Axios.js";
import { setAllCategory,setAllSubCategory, setCategoryLoading } from "./store/productSlice.js";
import AxiosToastError from "./utils/AxiosToastError.js";
import GlobalProvider from "./provider/GlobalProvider.jsx";
import CartMobile from "./components/Product/CartMobile.jsx";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  // Fetch user details
  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails();
      dispatch(setUserDetails(userData.data));
    } catch (error) {
      if (error?.response?.status !== 401) {
        AxiosToastError(err);
      }
    }

  };

  // Fetch categories
  const fetchCategory = async () => {
    try {
      dispatch(setCategoryLoading(true))
      
      const response = await api({
        ...SummaryApi.getCategory,
      });

      if (response.data?.success) {
        dispatch(setAllCategory(response?.data?.data)); // simplified
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setCategoryLoading(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await api({
        ...SummaryApi.getSubCategory,
      });

      if (response.data?.success) {
        dispatch(setAllSubCategory(response?.data?.data)); // simplified
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  


  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== '/checkout' && (
          <CartMobile/>
        )
      }
    </GlobalProvider>
  );
}

export default App;
