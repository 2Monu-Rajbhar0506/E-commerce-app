import React, { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useGlobalContext } from "../../provider/GlobalProvider.jsx";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const { incrementCartItemQty, decrementCartItemQty, addToCart } = useGlobalContext();
  const cartItems = useSelector((state) => state.cartItem.items);

  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [cartItemDetails, setCartItemDetails] = useState(null);

  // Sync cart item
  useEffect(() => {
    const item = cartItems.find(
      (i) => i?.productId?._id === data?._id
    );
    setCartItemDetails(item || null);
  }, [cartItems, data]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    await addToCart(data._id);
    setLoading(false);
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItemDetails || loadingId) return;

    setLoadingId(cartItemDetails._id);
    await decrementCartItemQty(cartItemDetails._id);
    setLoadingId(null);
  };

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItemDetails || loadingId) return;

    setLoadingId(cartItemDetails._id);
    await incrementCartItemQty(cartItemDetails._id);
    setLoadingId(null);
  };

  return (
    <div className="w-full max-w-[150px]">
      {cartItemDetails ? (
        <div className="flex items-center gap-3">
          <button
            disabled={loadingId === cartItemDetails._id}
            onClick={decreaseQty}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-1 rounded-md"
          >
            <FaMinus />
          </button>

          <p className="font-semibold">{cartItemDetails.quantity}</p>

          <button
            disabled={loadingId === cartItemDetails._id}
            onClick={increaseQty}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-1 rounded-md"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 transition text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? <LoaderIcon className="p-2 mt-1"/> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;

