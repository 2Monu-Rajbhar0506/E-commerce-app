import { createContext, useContext, useEffect,useMemo } from "react";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import { useDispatch } from "react-redux";
import { removeFromCart, setCartItems, upsertCartItem } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";


// GOLDEN RULE (very important)
// Redux updates must happen in ONE place only.
// Either:
// Context dispatches OR Component dispatches
// Never both

// Golden Rule
// Never refetch state that the backend already returned.
// Always update Redux directly from the API response.

// Golden rule (lock this in)
// Redux must be updated exactly once per user action,
// and only from one place (GlobalProvider).

// Backend decides quantity
// Redux mirrors backend
// Context orchestrates API calls
// Components only render


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
  
  const updateCartItem = async (id, qty) => {
    try {
      const response = await api({
        ...SummaryApi.updateCartItemQTY,
        data: {
          _id: id,
          qty: qty
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.data) {
          // toast.success(responseData.message)
          dispatch(upsertCartItem(responseData.data));
        } else {
          dispatch(removeFromCart(id));
        }
      }

    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  const incrementCartItemQty = async (id) => {
    try {
      const response = await api({
        ...SummaryApi.incrementCartItemQty,
        data: {
          _id: id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // toast.success(responseData.message)
         dispatch(upsertCartItem(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const decrementCartItemQty = async (id) => {
    try {
      const response = await api({
        ...SummaryApi.decrementCartItemQty,
        data: {
          _id: id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // toast.success(responseData.message)
        if (responseData?.data) {
          dispatch(upsertCartItem(responseData.data));
        } else {
          dispatch(removeFromCart(id))
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  
 const addToCart = async (productId) => {
   try {
     const response = await api({
       ...SummaryApi.addToCart,
       data: { productId },
     });

     const { data: responseData } = response;

     if (responseData.success) {
       dispatch(upsertCartItem(responseData?.data?.populatedItem));
       return responseData;
     }
   } catch (error) {
     AxiosToastError(error);
   }
 };

  
  
    useEffect(() => {
        fetchCartItem()
    },[])


const value = useMemo(
  () => ({
    fetchCartItem,
    updateCartItem,
    incrementCartItemQty,
    decrementCartItemQty,
    addToCart,
  }),
  [
    fetchCartItem,
    updateCartItem,
    incrementCartItemQty,
    decrementCartItemQty,
    addToCart,
  ]
);


  
    return (
      <GlobalContext.Provider
        value={value}
      >
        {children}
      </GlobalContext.Provider>
    );
};

export default GlobalProvider;