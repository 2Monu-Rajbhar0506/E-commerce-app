import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiMapPin,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import AddAddress from "../components/User/AddAddress";
import EditAddressDetails from "./User/EditAddressDetails";
import AxiosToastError from "../utils/AxiosToastError";
import api from "../utils/Axios";
import SummaryApi from "../common/summaryApi";
import { updateSingleAddress } from "../store/addressSlice";
import toast from "react-hot-toast";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  
  const dispatch = useDispatch()

  const handleDeleteAddress = async (id) => {
    try {
      const response = await api({
        ...SummaryApi.deleteAddress,
        data: { _id: id }
      })

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        dispatch(updateSingleAddress(responseData?.data?._id));
      }
    } catch (error) {
      AxiosToastError(error)
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 max-h-[82vh] overflow-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiMapPin className="text-blue-600 text-lg" />
        <h2 className="text-lg sm:text-xl font-semibold">Saved Addresses</h2>

        {/* Add Address Button */}
        <button
          onClick={() => setOpenAddress(true)}
          className="
             w-full sm:w-auto
             px-4 py-2
             text-sm font-semibold
             rounded-md
             bg-primary-100
             hover:text-white
             hover:bg-primary-200
             transition ml-auto
          "
        >
          + Add Address
        </button>
      </div>

      {/* Empty state */}
      {(!addressList || addressList.length === 0) && (
        <div className="bg-white rounded-lg p-6 text-center text-gray-600">
          No saved addresses yet.
        </div>
      )}

      {/* Grid */}
      <div className="w-full">
        {addressList?.map((address) => (
          <div
            key={address._id}
            className="
              relative
              bg-white
              border border-gray-200
              rounded-lg
              p-4
              shadow-sm
              hover:shadow-md
              transition
              flex flex-col mb-5
              
            "
          >
            {/* Active badge */}
            {address.is_active && (
              <div
                key={address._id}
                className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"
              >
                <FiCheckCircle />
                Active
              </div>
            )}

            {/* Address */}
            <p className="font-semibold text-gray-900 leading-snug text-sm sm:text-base">
              {address.address_line}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {address.city}, {address.state}
            </p>

            <p className="text-sm text-gray-600">
              {address.country} –{" "}
              <span className="font-medium">{address.pincode}</span>
            </p>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-gray-800 mt-2">
              <FiPhone className="text-gray-500" />
              <span className="font-medium">{address.mobile}</span>
            </div>

            {/* Divider */}
            <div className="border-t mt-3 pt-3 flex gap-4">
              <button
                onClick={() => {
                  setOpenEdit(true), setEditData(address);
                }}
                className="
                  flex items-center gap-1 text-sm
                  text-blue-600 hover:text-blue-700
                "
              >
                <FiEdit2 /> Edit
              </button>

              <button
                onClick={() => handleDeleteAddress(address?._id)}
                className="
                  flex items-center gap-1 text-sm
                  text-red-600 hover:text-red-700
                "
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && (
        <EditAddressDetails close={() => setOpenEdit(false)} data1={editData} />
      )}
    </div>
  );
};

export default Address;
