import React, { useState, useRef, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [Verifyloading, setVerifyLoading] = useState(false);
  //get the user email via routes i.e: useLocation
  const userEmail = location?.state?.email;
  console.log(location);

  // Auto focus on first input when page loads
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle change & move focus
  const handleChange = (value, index) => {
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace, arrow navigation, & paste
  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event: distribute digits across boxes
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^[0-9]+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);

    {
      /** If pasted text is 6 digits, reset completely, if less, preserve existing*/
    }
    const updatedOtp = [...otp];

    digits.forEach((digit, i) => {
      updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);

    if (digits.length === 6) {
      inputRefs.current[5]?.blur();
      verifyOtp(digits.join(""));
    } else {
      inputRefs.current[digits.length]?.focus();
    }
    /**blur() removes focus from the last box (index 5), meaning the user visually understands that input is complete and locked for verification. */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    verifyOtp(otpValue);
  };

  const verifyOtp = async (otpValue) => {
    // if (!userEmail) return toast.error("Missing email. Please try again.");

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifyLoading(true);
      const response = await api({
        ...SummaryApi.verifyOtp,
        data: { otp: otpValue, email: userEmail },
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        setOtp(Array(6).fill(""));
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: userEmail,
          },
        });
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setVerifyLoading(false);
    }
  };

  /**Here, data is not a predefined variable — it's simply a property of the request configuration object you're passing into api() (Axios instance).
It works because Axios accepts an object with fields like:
url
method
headers
params
data ← this is where request body is passed for POST/PUT/PATCH 
So where is "data" defined?
 In the Axios request config object.
 Example Axios signature:
 axios({
  method: "POST",
  url: "/something",
  data: { key: "value" } // <-- this is what you're doing
})
*/

  const handleResetOtp = async () => {
    if (timer > 0) return;

    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.resendforgotPasswordOtp,
        data: { email: userEmail },
      });

      console.log("Resend response : ", response);

      if (response?.data?.success) {
        toast.success(response?.data?.message);

        // Reset OTP UI
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();

        // Start 30 second countdown
        setTimer(30);
      }
    } catch (error) {
      console.log("Error response:", error?.response?.data);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  //avoids orphan intervals if user navigates away quickly.
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!userEmail) {
      toast.error("Email missing — please restart verification.");
      navigate("/forgot-password", { replace: true });
    }
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <IoArrowBack size={26} />
      </button>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the 6-digit verification code sent to you
        </p>

        {/* OTP Boxes */}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl outline-none bg-gray-50 focus:border-amber-500 focus:ring-2 focus:ring-amber-300"
              />
            ))}
          </div>

          <button
            type="submit"
            className={
              Verifyloading
                ? `w-full mt-8 py-3 bg-amber-500  text-white font-semibold rounded-xl transition`
                : `w-full mt-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition`
            }
          >
            {Verifyloading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Didn’t receive the code ?{" "}
          <button
            onClick={handleResetOtp}
            disabled={timer > 0 || loading}
            className={`font-medium ${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-amber-600 hover:underline"
            } `}
          >
            {loading
              ? "Sending OTP..."
              : timer > 0
              ? `Resend OTP in ${timer}s`
              : "Resend OTP"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;

/**What does this mean?
/^[0-9]$/ → A regex pattern that matches exactly one digit (0 through 9).
.test(value) → Checks whether the input matches the regex.
value !== "" → Allows empty value (for backspace).
So, the condition:
If value is not empty AND it is not a digit, then stop execution (return), meaning do not update the OTP state.
 Why needed?
Without this validation:
The user could type letters, symbols, or multiple characters, which breaks OTP behavior. */
