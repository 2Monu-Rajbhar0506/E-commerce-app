
import React, { useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/Axios.js";
import SummaryApi from "../common/summaryApi.js";
import AxiosToastError from "../utils/AxiosToastError.js";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
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

    setLoading(true);

    try {
      const response = await api({
        ...SummaryApi.forgotPassword,
        data,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        console.log("Success response: ", response?.data?.message);
        setData({
          email: "",
        });
        navigate("/verify-otp", { state: { email: data.email } });
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

  /**There are 3 key reasons why typing in this input updates data.email:

1)name="email" identifies which key in state to update

Whatever value you type will be stored in state key that matches this name.

2)value={data.email} binds the input to state

This makes it a controlled component, meaning the input always reflects the latest state.

3) onChange={handleChange} triggers this function when typing
const handleChange = (e) => {
  const { name, value } = e.target;

  setData((prev) => ({
    ...prev,
    [name]: value,  // <-- this updates data.email when name="email"
  }));
};

| Step | What Happens                                                         |
| ---- | -------------------------------------------------------------------- |
| 1    | You type inside input                                                |
| 2    | `onChange` fires → `handleChange(e)` runs                            |
| 3    | `name="email"` so `name` equals `"email"`                            |
| 4    | `value` equals `"test@gmail.com"`                                    |
| 5    | `setData()` runs and updates: `{ ...prev, email: "test@gmail.com" }` |
| 6    | React re-renders & `value={data.email}` shows the updated text       |


*/

  return (
    <section className="container mx-auto px-2">
      <div className="bg-white my-6 w-full max-w-lg mx-auto rounded-lg shadow p-6">
        <h2 className="text-shadow-lg text-amber-600 font-semibold  text-center  mb-5">
          Welcome to Binkyit
        </h2>

        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to get OTP
          </p>
        </div>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account ?{" "}
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

export default ForgotPassword;
