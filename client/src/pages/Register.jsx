import React, { useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast'
import api from "../utils/Axios.js"
import SummaryApi from "../common/summaryApi.js";
import AxiosToastError from "../utils/AxiosToastError.js"
import  { Link,useNavigate } from "react-router-dom"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //it will iterate one by one and check all values are present, if all values are present then it will return true, & if any of them is not present then it will return false.
  const valideValue = Object.values(data).every((el) => el.trim()); //will return the values of data in the form of array if present, otherwise if not present it will give empty value in the form of array.

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password must be same");
      return;
    }

    setLoading(true);

    try {
      const response = await api({
        ...SummaryApi.register,
        data,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        console.log("Success response: ", response?.data?.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.log("Error response:", error?.response?.data);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  /**Your console.log("response", response?.data?.message) will never run when 400 status comes, because when Axios receives any non-2xx status code, it jumps directly into the catch block`.
   * | API Status | Goes to | `console.log(response...)` runs? |
     | ---------- | ------- | -------------------------------- |
     | `2xx`      | `try`   | ✔️ Yes                           |
     | `3xx`      | `catch` | ❌ No                             |
     | `4xx`      | `catch` | ❌ No                             |
     | `5xx`      | `catch` | ❌ No                             |

   */

  return (
    <section className="container mx-auto px-2">
      <div className="bg-white my-6 w-full max-w-lg mx-auto rounded-lg shadow p-6">
        <h2 className="text-shadow-lg text-amber-600 font-semibold  text-center  mb-5">
          Welcome to Binkyit
        </h2>

        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">
            The one & Only platform for all categories
          </p>
        </div>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="grid gap-1">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:outline-none focus:border-yellow-500"
              value={data.name}
              name="name"
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:outline-none focus:border-yellow-500"
              value={data.email}
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-yellow-500">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-full outline-none focus:outline-none"
                value={data.password}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-600 hover:text-black transition cursor-pointer px-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/*Confirm Password */}
          <div className="grid gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Confirm Password
            </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-yellow-500">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full h-full outline-none focus:outline-none"
                value={data.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Enter your confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-gray-600 hover:text-black transition cursor-pointer px-1"
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!valideValue}
            type="submit"
            className={`${
              valideValue
                ? "bg-amber-500 text-white py-2 rounded font-semibold my-3 tracking-wide hover:bg-amber-400"
                : "bg-gray-400 text-white py-2 rounded font-semibold my-3 tracking-wide hover:bg-gray-500"
            } `}
          >
            {loading ? "Creating Account..." : "Register"}
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
    </section>
  );
};

export default Register;
