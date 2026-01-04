import React from "react";
import { IoClose } from "react-icons/io5";
import { Link,useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { PriceWithDiscount } from "../../utils/PriceWithDiscount";
import imageEmpty from "../../assets/empty_cart.webp"


const DisplayCartItem = ({ close }) => {
    const { originalPrice, totalPrice, totalQty } = useGlobalContext();
    const cartItem = useSelector((state) => state.cartItem.items);
    const user = useSelector(state => state.user)
    const navigate = useNavigate();
  // console.log("User details:",user);
    
  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) {
        close();
      }
      return
    } else {
      toast.error("Please Login")
    }
  }
  
  return (
    <section className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="ml-auto h-screen w-full max-w-md bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 shadow-sm border-b border-gray-300">
          <h2 className="text-lg font-semibold">My Cart</h2>

          <Link
            to="/"
            className="lg:hidden bg-gray-200 rounded text-gray-700 hover:bg-gray-300 transition"
          >
            <IoClose size={24} />
          </Link>

          <button
            onClick={close}
            className="hidden lg:block bg-gray-200 rounded text-gray-700 hover:bg-gray-300 transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden bg-blue-50 px-2 py-3 flex flex-col gap-4">
          {/* Savings Banner */}
          <div className="flex justify-between items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            <span>Your total savings</span>
            <span>{DisplayPriceInRupees(originalPrice - totalPrice)}</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto bg-white rounded-xl p-4 flex flex-col gap-4 scrollbarCustom">
            {Array.isArray(cartItem) && cartItem.length > 0 ? (
              cartItem.map((item) => (
                <div
                  key={item._id}
                  className=" relative flex items-center  gap-4 p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
                >
                  {/* Image */}
                  <div className="w-20 h-20  rounded-lg border border-blue-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={item?.productId?.image?.[0] || "/placeholder.png"}
                      alt={item?.productId?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1 pr-16 ">
                    <p className="text-sm font-semibold line-clamp-2">
                      {item?.productId?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item?.productId?.unit}
                    </p>

                    <p className="text-sm font-bold text-green-700">
                      {DisplayPriceInRupees(
                        PriceWithDiscount(
                          item?.productId?.price,
                          item?.productId?.discount
                        )
                      )}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="absolute bottom-3 right-3">
                    <AddToCartButton data={item?.productId} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div>
                  <img src={imageEmpty} alt="Empty Cart" />
                </div>
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          {Array.isArray(cartItem) && cartItem.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
                Bill Details
              </h3>

              {/* Items Total */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span className="flex items-center gap-2">
                  <span className="line-through text-gray-400">
                    {DisplayPriceInRupees(originalPrice)}
                  </span>
                  <span className="font-medium text-gray-800">
                    {DisplayPriceInRupees(totalPrice)}
                  </span>
                </span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Quantity</span>
                <span className="font-medium">{totalQty} items</span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charge</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              {/* Divider */}
              <div className="border-t pt-2 flex justify-between items-center text-base font-semibold text-gray-900">
                <span>Grand Total</span>
                <span className="text-green-700">
                  {DisplayPriceInRupees(totalPrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-300 bg-white sticky bottom-0">
          <div className="bg-green-700 text-white rounded-xl p-4 flex items-center justify-between shadow-md">
            <span className="text-base font-bold">
              {DisplayPriceInRupees(totalPrice)}
            </span>

            {Array.isArray(cartItem) && cartItem.length > 0 ? (
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-2 font-semibold hover:opacity-90 transition"
              >
                Proceed
                <FaCaretRight />
              </button>
            ) : (
              <Link
                onClick={close}
                to={"/"}
                className="flex items-center gap-2 font-semibold hover:opacity-90 transition"
              >
                Shop now <FaCaretRight />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisplayCartItem;
