import React, { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { updateAvatar } from "../store/userSlice";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

    
  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];

      if (!file) {
          return;
      }

    const formData = new FormData();
    formData.append("image", file);


    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.uploadAvatar,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        
      if(response?.data?.success){
          const { data: responseData } = response;
          dispatch(updateAvatar(responseData.data.avatar));
          toast.success("Avatar updated!");
          if (close) {
            close(); // Close modal on success, close();-->immediatedly close after image upload because we are calling the function directly, close; --> you have to manually close via button, when you click only that time the function will be called.
          }
      } else {
          toast.error("Avatar does not updated");
      }
      
     
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Profile Photo</h3>
          <button
            onClick={close}
            className="text-neutral-500 hover:text-neutral-700 w-fit block ml-auto"
          >
            <IoMdCloseCircleOutline size={25} />
          </button>
        </div>

        {/* Avatar */}
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-md bg-neutral-200 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegCircleUser size={70} className="text-neutral-600" />
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-6 text-center">
          <label htmlFor="uploadAvatar">
            <div className="cursor-pointer bg-primary-200 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-300 transition">
              {loading ? "Uploading..." : "Upload New Photo"}
            </div>
          </label>

          <input
            type="file"
            id="uploadAvatar"
            className="hidden"
            accept="image/*"
            onChange={handleUploadAvatarImage}
          />
        </div>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
