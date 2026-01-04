import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../../provider/GlobalProvider";
import AddAddress from "../../components/User/AddAddress";
import { useNavigate } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";
import { clearCart } from "../../store/cartProduct";

const CheckOutPage = () => {
  const { originalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.items);
  const [openAddress, setOpenAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(0);
  const addressList = useSelector((state) => state.addresses.addressList);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(addressList);
  }, []);

  console.log(addressList[selectAddress]);
  const selectedAddress = addressList[selectAddress];
  const dispatch = useDispatch()

  const handleCashOnDelivery = async () => {
    if (!selectAddress) {
      return toast.error("Please select at least one address");
    }
      try {
        const response = await api({
          ...SummaryApi.cashOnDelivery,
          data: {
            list_items: cartItem,
            totalAmt: totalPrice,
            subTotalAmt: originalPrice,
            addressId: selectedAddress._id,
          },
        });

        const { data: responseData } = response;

        if (responseData.success) {
          toast.success(responseData.message);
          dispatch(clearCart());
        }
        navigate("/success",{
          state: {
              text:"Order"
            }
        })
      } catch (error) {
        AxiosToastError(error);
      }
  }


  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...")
      const response = await api({
        ...SummaryApi.payment_Url,
        data: {
          list_items: cartItem,
          addressId: selectedAddress._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        window.location.href = responseData.data.url;
        
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };












  return (
    <section className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>

              <div className="w-full mb-4">
                <h3 className="text-lg font-semibold mb-3">
                  Choose your address
                </h3>

                <div className="grid gap-4">
                  {addressList.map((address, index) => {
                    if (!address.is_active) return null;

                    const isSelected = selectAddress === String(index);

                    return (
                      <label
                        key={address._id || index}
                        htmlFor={`address-${index}`}
                        className={`
                                    relative cursor-pointer
                                    border rounded-xl p-4
                                    transition-all
                                    flex gap-4 items-start
                                    ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }
                                  `}
                      >
                        <input
                          id={`address-${index}`}
                          type="radio"
                          name="address"
                          value={index}
                          checked={isSelected}
                          onChange={(e) => setSelectAddress(e.target.value)}
                          className="mt-1 accent-blue-600"
                        />

                        <div className="flex flex-col gap-1 text-sm text-gray-700">
                          <p className="font-medium text-gray-900">
                            {address.address_line}
                          </p>

                          <p>
                            {address.city}, {address.state}
                          </p>

                          <p>
                            {address.country} –{" "}
                            <span className="font-medium">
                              {address.pincode}
                            </span>
                          </p>

                          <p className="text-gray-800 font-medium">
                            {address.mobile}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            Selected
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div
                onClick={() => setOpenAddress(true)}
                className="h-28 border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
              >
                <span className="text-sm text-gray-500">
                  No address selected
                </span>
                <span className="mt-1 text-sm font-medium text-blue-700">
                  + Add New Address
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT : SUMMARY */}
          <div className="w-full lg:w-[380px] space-y-4 lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              {Array.isArray(cartItem) && cartItem.length > 0 && (
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="flex gap-2">
                      <span className="line-through text-gray-400">
                        {DisplayPriceInRupees(originalPrice)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {DisplayPriceInRupees(totalPrice)}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Quantity</span>
                    <span className="font-medium text-gray-900">
                      {totalQty} items
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-base font-semibold text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-green-700">
                      {DisplayPriceInRupees(totalPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT ACTIONS */}
            <div
              onClick={handleOnlinePayment}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3"
            >
              <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Pay Online
              </button>

              <button
                onClick={handleCashOnDelivery}
                className="w-full py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-lg transition"
              >
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckOutPage;
