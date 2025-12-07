import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  // loading | success | failed

  useEffect(() => {
    if (!token) {
      setStatus("failed");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api({
          ...SummaryApi.VerifyEmail,
          data: { token },
        });

        if (response.data.success) {
          setStatus("success");
          toast.success("Email verified successfully!");
          navigate("/");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
        {status === "loading" && (
          <>
            <h2 className="text-lg font-semibold">Verifying Email...</h2>
            <p className="text-neutral-600">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-lg font-semibold text-green-600">
              Email Verified 🎉
            </h2>
            <p className="text-neutral-600">Redirecting to login...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-lg font-semibold text-red-500">
              Invalid or Expired Token
            </h2>
            <p className="text-neutral-600">
              Please request a new verification email.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
