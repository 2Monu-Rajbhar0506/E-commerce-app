import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "./Divider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPackage, FiMapPin, FiLogOut, FiUser } from "react-icons/fi";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import { logoutUser } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiBox, FiUpload, FiFolder, FiLayers } from "react-icons/fi";
import isAdmin from "../utils/isAdmin";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogout2 } = useGlobalContext();

  const handleLogout = async() => {
    try {
      const response = await api({
        ...SummaryApi.logout
      })

      if (response?.data?.success) {
        if (close) {
          close();
        }
        dispatch(logoutUser());
        handleLogout2();
        toast.success(response?.data?.message);
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close();
    }
  }


  return (
    <div className="text-gray-800 min-w-56 min-h-screen ">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 ">
        <FiUser className="text-xl text-indigo-600" />
        <div>
          <div className="font-semibold text-base">My Account</div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="max-w-52 text-ellipsis line-clamp-1">
              {user.name || user.mobile} <span className="text-medium text-red-400">{ user.role === "ADMIN" ? "(Admin)" : ""}</span>
            </span>
            <Link
              onClick={handleClose}
              to={"/dashboard/Profile"}
              className="hover:text-amber-500"
            >
              <FaExternalLinkAlt size={15} />
            </Link>
          </div>
        </div>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="text-sm grid gap-1 mt-2">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/category"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <FiFolder className="text-lg" />
            Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/subcategory"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <FiLayers className="text-lg" />
            Sub Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/uploadproduct"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <FiUpload className="text-lg" />
            Upload Product
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/product"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <FiBox className="text-lg" />
            Product
          </Link>
        )}

        <Link
          onClick={handleClose}
          to="/dashboard/myorders"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          <FiPackage className="text-lg" />
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          <FiMapPin className="text-lg" />
          Saved Address
        </Link>

        <button
          className="flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition font-medium text-red-600"
          onClick={handleLogout}
        >
          <FiLogOut className="text-lg" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
