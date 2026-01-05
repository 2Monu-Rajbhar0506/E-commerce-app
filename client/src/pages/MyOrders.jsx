import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData.jsx";
import {DisplayPriceInRupees} from "../utils/DisplayPriceInRupees.js"
import AxiosToastError from "../utils/AxiosToastError.js";
import api from "../utils/Axios.js";
import SummaryApi from "../common/summaryApi.js";
import { removeFromOrders } from "../store/orderSlice.js";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";


const MyOrders = () => {
  const { fetchOrder } = useGlobalContext();
  const orders = useSelector((state) => state.order.orders);
  const dispatch = useDispatch();

  //ALWAYS call hooks first
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (!orders?.length) {
    return <NoData />;
  }

  const handleCancelOrder = async (_id) => {
    try {
      const response = await api({
        ...SummaryApi.cancelOrder,
        data: {
          _id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        dispatch(removeFromOrders(responseData?.data?._id));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 shadow p-3 rounded-xl">
          My Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage your recent purchases
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6 ">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-300"
          >
            {/* Order Header */}
            <div className="flex flex-wrap justify-between items-center px-6 py-4 border-b border-gray-100 gap-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{order.orderId}</p>

                {/* Payment Method */}
                <p className="text-xs text-gray-500 mt-1">
                  Payment:{" "}
                  <span className="font-medium text-gray-700">
                    {order.paymentId?.startsWith("PYD-")
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Delivery Status */}
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  {order.delivery_status}
                </span>

                {/* Payment Status */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    order.payment_status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : order.payment_status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Payment: {order.payment_status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-800">
                    {DisplayPriceInRupees(item.priceAtPurchase)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer / Total */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-2xl">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">
                {DisplayPriceInRupees(order.totalAmt)}
              </p>
            </div>
            <button
              disabled={order.payment_status === "SUCCESS"}
              onClick={() => handleCancelOrder(order._id)}
              className={`text-sm border p-2 rounded-md m-4 ${
                order.payment_status === "SUCCESS"
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Cancel order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
