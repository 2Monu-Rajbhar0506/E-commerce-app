import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  Shield,
  Clock,
  Pencil,
} from "lucide-react";

import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import ImagePreviewModal from "../components/ImagePreviewModel";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
   const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

    
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
      setUserData((prev) => ({
          ...prev, [name]: value
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);

        const freshUserData = await fetchUserDetails();
        dispatch(setUserDetails(freshUserData.data));
        setEditOpen(false); // Close edit section after save
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

   const handleResendVerifyOtp = async () => {
     try {
       setVerifyLoading(true);

       const response = await api({
         ...SummaryApi.resendVerifyEmailOtp,
         data: { email: userData.email },
       });

       if (response.data.success) {
         toast.success(response.data.message);
       } else {
         toast.error(response.data.message || "Something went wrong.");
       }
     } catch (error) {
       AxiosToastError(error);
     } finally {
       setVerifyLoading(false);
     }
   };

    
    
    
  return (
    <div className="p-4">
      {/* ---------------------- PROFILE HEADER ---------------------- */}
      <div className="flex items-center gap-6 mb-6">
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full overflow-hidden shadow-md bg-neutral-200 cursor-pointer flex items-center justify-center"
          onClick={() => user.avatar && setPreviewOpen(true)}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegCircleUser size={60} className="text-neutral-500" />
          )}
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-neutral-600 flex items-center gap-1">
            {user.email}

            {user.verify_email && (
              <CheckCircle size={18} className="text-green-500" />
            )}
          </p>

          <button
            onClick={() => setOpenProfileAvatarEdit(true)}
            className="text-sm mt-2 px-4 py-1.5 rounded-full bg-primary-200 text-white hover:bg-primary-300"
          >
            Change Photo
          </button>
          {!user.verify_email && (
            <button
              onClick={handleResendVerifyOtp}
              className="text-sm mt-2 px-4 py-1.5 rounded-full bg-primary-200 text-white hover:bg-primary-300"
            >
              {verifyLoading ? "Sending OTP..." : "Verify Email"}
            </button>
          )}
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
      )}

      {/* Image Preview Modal */}
      {previewOpen && (
        <ImagePreviewModal
          src={user.avatar}
          close={() => setPreviewOpen(false)}
        />
      )}

      {/* ---------------------- DETAILS CARD WITH EDIT BUTTON ---------------------- */}
      <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Profile Information</h3>

          <button
            onClick={() => setEditOpen(!editOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-neutral-200 hover:bg-neutral-300"
          >
            <Pencil size={16} /> Edit
          </button>
        </div>

        {/* NON-EDITABLE INFORMATION */}
        {!editOpen && (
          <div className="grid gap-3 text-neutral-700">
            <div className="flex items-center gap-3">
              <User size={18} className="text-primary-300" />
              <span>
                <b>{user.name}</b>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-primary-300" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-primary-300" />
              <span>{user.mobile}</span>
            </div>
          </div>
        )}

        {/* EDITABLE FORM */}
        {editOpen && (
          <form className="grid gap-5 max-w-lg mt-3" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid gap-1">
              <label className="font-medium flex items-center gap-2">
                <User size={18} className="text-primary-300" /> Name
              </label>
              <input
                type="text"
                className="p-3 border rounded-lg bg-blue-50 outline-none focus:border-primary-300"
                onChange={handleOnChange}
                name="name"
                value={userData.name}
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-1">
              <label className="font-medium flex items-center gap-2">
                <Mail size={18} className="text-primary-300" /> Email
              </label>
              <input
                type="email"
                className="p-3 border rounded-lg bg-blue-50 outline-none focus:border-primary-300"
                onChange={handleOnChange}
                name="email"
                value={userData.email}
                required
              />
            </div>

            {/* Mobile */}
            <div className="grid gap-1">
              <label className="font-medium flex items-center gap-2">
                <Phone size={18} className="text-primary-300" /> Mobile
              </label>
              <input
                type="text"
                className="p-3 border rounded-lg bg-blue-50 outline-none focus:border-primary-300"
                onChange={handleOnChange}
                name="mobile"
                value={userData.mobile}
                required
              />
            </div>

            <button
              type="submit"
              className="w-max px-6 py-2 rounded-lg bg-primary-200 text-white hover:bg-primary-300 font-medium"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>

      {/* ---------------------- ACCOUNT DETAILS ---------------------- */}
      <div className="bg-white p-5 rounded-xl shadow-sm border grid gap-4 max-w-xl">
        <h3 className="text-lg font-semibold">Account Details</h3>

        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-primary-300" />
          <span>
            Joined: <b>{user.createdAt ? user.createdAt.split("T")[0] : "-"}</b>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={20} className="text-primary-300" />
          <span>
            Last Updated:{" "}
            <b>{user.updatedAt ? user.updatedAt.split("T")[0] : "-"}</b>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <span>
            Email Verified: <b>{user.verify_email ? "Yes" : "No"}</b>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Shield size={20} className="text-blue-500" />
          <span>
            Role: <b>{user.role || "User"}</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
