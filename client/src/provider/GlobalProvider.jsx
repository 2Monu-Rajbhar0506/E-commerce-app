import { createContext, useContext, useEffect } from "react";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import { useDispatch } from "react-redux";
import { setCartItems } from "../store/cartProduct";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

    const dispatch = useDispatch()

    const fetchCartItem = async () => {
        try {
          const response = await api({
            ...SummaryApi.getCartItem,
          })
          const { data: responseData } = response;
    
          if (responseData.success) {
            dispatch(setCartItems(responseData.data))
            //console.log(responseData.data);   
          }
    
        } catch (error) {
          AxiosToastError(error)
        }
      }

    useEffect(() => {
        fetchCartItem()
    },[])


    return (
      <GlobalContext.Provider value={{ fetchCartItem }}>
        {children}
      </GlobalContext.Provider>
    );
};

export default GlobalProvider;