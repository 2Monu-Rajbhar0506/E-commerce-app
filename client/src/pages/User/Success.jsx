import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cartProduct";

const Success = () => {
  const location = useLocation();
  const message = location?.state?.text || "Payment";
  const dispatch = useDispatch();


  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center gap-4 animate-fadeIn">
      
        <FaCheckCircle className="text-green-600 text-6xl" />

   
        <h2 className="text-2xl font-bold text-green-700">
          {message} Successful!
        </h2>

     
        <p className="text-gray-600 text-sm">
          Thank you for your order. Your transaction has been completed
          successfully.
        </p>


        <div className="w-full border-t my-2"></div>

        <div className="flex gap-3">
          <Link
            to="/"
            className="px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Go to Home
          </Link>

          <Link
            to="/dashboard/myorders"
            className="px-5 py-2 rounded-md border border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
