import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../utils/Axios.js";
import toast from "react-hot-toast";
import { AiOutlineLock } from "react-icons/ai";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import SummaryApi from "../common/summaryApi";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userEmail = location?.state?.email;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password.length < 6 || confirmPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password must be same");
      return;
    }

    try {
      setLoading(true);
      const response = await api({
        ...SummaryApi.resetPasswordOtp,
        data: {
          email: userEmail,
          newPassword: password,
          confirmPassword: confirmPassword,
        },
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/login");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
      if (!userEmail) {
        toast.error("Email missing — please restart verification.");
        navigate("/forgot-password", { replace: true });
      }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-5">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block mb-1 text-gray-700">New Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                type={showPass ? "text" : "password"}
                className="w-full border rounded-md pl-10 pr-10 py-2 outline-none focus:ring focus:ring-indigo-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-700">Confirm Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                type={showConfirmPass ? "text" : "password"}
                className="w-full border rounded-md pl-10 pr-10 py-2 outline-none focus:ring focus:ring-indigo-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter confirm password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:text-purple-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;


