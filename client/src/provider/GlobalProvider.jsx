import { createContext, useContext, useEffect,useMemo, useState } from "react";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setCartItems, upsertCartItem, clearCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrders } from "../store/orderSlice";


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
  const cartItem = useSelector((state) => state?.cartItem?.items);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const userDetails = useSelector(state => state.user)

  const dispatch = useDispatch();

  const fetchCartItem = async () => {
    try {
      const response = await api({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setCartItems(responseData.data));
        //console.log(responseData.data);
      }
    } catch (error) {
      if (error?.response?.status !== 401) {
        AxiosToastError(error);
      }
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await api({
        ...SummaryApi.updateCartItemQTY,
        data: {
          _id: id,
          qty: qty,
        },
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
          dispatch(removeFromCart(id));
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


  const fetchAddress = async() => {
    try {
      const response = await api({
        ...SummaryApi.getAddress,
      })

      const { data: responseData } = response;
      
      if (responseData.success) {
        //console.log(responseData);
        dispatch(handleAddAddress(responseData.data))
      }

    } catch (error) {
      if (error?.response?.status !== 401) {
        AxiosToastError(error);
      }
    }
  }

 const fetchOrder = async () => {
   try {
     const response = await api({
       ...SummaryApi.getOrderDetails,
     });
     const { data: responseData } = response;

     if (responseData.success) {
       dispatch(setOrders(responseData.data));
     }
   } catch (error) {
     if (error?.response?.status !== 401) {
       AxiosToastError(error);
     }
   }
 };



//used in userMenu file
const handleLogout2 = () => {
  localStorage.clear();
  dispatch(clearCart());
  dispatch(handleAddAddress([])); // optional
};


useEffect(() => {
  if (userDetails?._id) {
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }
}, [userDetails]);


  //total item and total price
    useEffect(() => {
      const qty = cartItem.reduce((prev, curr) => {
        return prev + curr.quantity
      }, 0);

      setTotalQty(qty);
      
      const totalPrice = cartItem.reduce((prev, curr) => {
       const priceAfterDiscount = PriceWithDiscount(curr?.productId?.price, curr?.productId?.discount); 
       return prev + (priceAfterDiscount * curr.quantity);
      }, 0);

      setTotalPrice(totalPrice);

      const originalPrice = cartItem.reduce((prev, curr) => {
       return prev + (curr?.productId?.price * curr.quantity);
      }, 0);

      setOriginalPrice(originalPrice);

    }, [cartItem]);

  const value = useMemo(
    () => ({
      fetchCartItem,
      updateCartItem,
      incrementCartItemQty,
      decrementCartItemQty,
      addToCart,
      totalQty,
      totalPrice,
      originalPrice,
      handleLogout2,
      fetchOrder,
    }),
    [
      fetchCartItem,
      updateCartItem,
      incrementCartItemQty,
      decrementCartItemQty,
      addToCart,
      totalPrice,
      totalQty,
      originalPrice,
      handleLogout2,
      fetchOrder,
    ]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;