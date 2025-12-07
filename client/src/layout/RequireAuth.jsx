import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails, logoutUser } from "../store/userSlice.js";
import api from "../utils/Axios.js";
import SummaryApi from "../common/summaryApi.js";

const RequireAuth = ({ children, roles = [] }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const LoadUserDetails = async () => {
      try {
        // If user already available in redux, skip refresh
        if (user?._id) {
          setLoading(false);
          return;
        }

        // Load login users data
        const response = await api({ ...SummaryApi.userDetails });

       // console.log("User Details Response:", response.data);

        if (response.data?.success && response.data?.data) {
          dispatch(setUserDetails(response.data.data));
        } else {
          dispatch(logoutUser());
        }
      } catch (err) {
        dispatch(logoutUser());
      } finally {
        setLoading(false);
      }
    };

    LoadUserDetails();
  }, [dispatch, user?._id]);

  // still checking via refresh token
  if (loading) {
    return (
      <p className="text-blue-600 bg-blue-100 p-3 rounded">
        Checking authentication...
      </p>
    );
  }

  // After checking → still not logged in
  if (!user?._id) {
    return (
      <p className="text-red-600 bg-red-100 p-4 rounded">
        You must be logged in to access this page
      </p>
    );
  }

  // role-based check
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <p className="text-red-600 bg-red-100 p-4 rounded">
        You do not have permission to access this page
      </p>
    );
  }

  return children;
};

export default RequireAuth;
