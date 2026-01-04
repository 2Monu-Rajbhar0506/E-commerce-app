import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const Cancel = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center gap-4 animate-fadeIn">
        {/* Icon */}
        <FaTimesCircle className="text-red-600 text-6xl" />

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-700">Order Cancelled</h2>

        {/* Message */}
        <p className="text-gray-600 text-sm">
          Your order was not completed. If any amount was deducted, it will be
          refunded within 5–7 working days.
        </p>

        {/* Divider */}
        <div className="w-full border-t my-2"></div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/"
            className="px-5 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Go to Home
          </Link>

          <Link
            to="/cart"
            className="px-5 py-2 rounded-md border border-red-600 text-red-700 font-medium hover:bg-red-50 transition"
          >
            Retry Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
