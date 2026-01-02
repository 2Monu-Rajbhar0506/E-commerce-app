import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../../provider/GlobalProvider";

const CartMobile = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.items);

  return (
    <>
      {Array.isArray(cartItem) && cartItem.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 p-2 z-40">
          <div className="bg-green-600 px-3 py-2 rounded-lg text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded">
                <FaCartShopping />
              </div>
              <div className="text-xs">
                <p>{totalQty} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to="/cart" className="flex items-center gap-1 font-semibold">
              <span>View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );

};

export default CartMobile;
