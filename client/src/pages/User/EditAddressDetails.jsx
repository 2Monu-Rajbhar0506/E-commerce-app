import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import AxiosToastError from "../../utils/AxiosToastError";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateSingleAddress } from "../../store/addressSlice";


// Golden Rule (remember forever)
// Never use required with boolean fields in React Hook Form
// “React Hook Form tracks validation errors inside formState.errors.
// Each field error contains a message which we conditionally render.
// register() connects the input to RHF and applies validation rules.
// isSubmitting prevents duplicate submissions and improves UX.”



const EditAddressDetails = ({ close, data1 }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      addressline: data1.address_line,
      city: data1.city,
      state: data1.state,
      pincode: data1.pincode,
      country: data1.country,
      mobile: data1.mobile,
      is_active: data1.is_active,
    },
  });
    const dispatch = useDispatch();
    
    const onSubmit = async (data) => {
        //console.log(data);
        try {
            const response = await api({
                ...SummaryApi.updateAddress,
                data: {
                    _id: data1._id,
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    country: data.country,
                    mobile: data.mobile,
                    is_active: data.is_active,
                },
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                dispatch(updateSingleAddress(responseData.data))
                if (close) {
                    close?.();
                }
                reset();
            }
    
        } catch (error) {
            AxiosToastError(error);
        }
    };


  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start sm:items-center justify-center overflow-y-auto animate-fadeIn">
      <div
        className="
          bg-white
          p-6
          w-full
          max-w-[95%]
          sm:max-w-lg
          md:max-w-2xl
          lg:max-w-3xl
          mt-8 sm:mt-0
          mx-auto
          rounded-xl
          shadow-lg
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-2 sm:px-5 border-b border-gray-300 sticky top-0 bg-white z-10">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <FiMapPin className="text-blue-600" />
            Edit Address
          </h3>

          <button
            onClick={close}
            className="text-gray-600 hover:text-black transition"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          {/* Address Line */}
          <div className="sm:col-span-2 mt-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address Line
            </label>
            <input
              id="address"
              type="text"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("addressline", {
                required: "Address is required",
                minLength: { value: 5, message: "Too short" },
              })}
            />
            {errors.addressline && (
              <p className="text-red-500 text-xs mt-1">
                {errors.addressline.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              type="text"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="text-sm font-medium text-gray-700"
            >
              State
            </label>
            <input
              id="state"
              type="text"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label
              htmlFor="pincode"
              className="text-sm font-medium text-gray-700"
            >
              Pincode
            </label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Invalid pincode",
                },
              })}
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="sm:col-span-2">
            <label
              htmlFor="mobile"
              className="text-sm font-medium text-gray-700"
            >
              Mobile No
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              className="
                w-full mt-1 p-2 rounded
                border border-gray-300
                bg-blue-50
                focus:outline-none
                focus:border-primary-200
              "
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid mobile number",
                },
              })}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className="sm:col-span-2">
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Address Status
            </label>

            <select
              id="is_active"
              className="
                  w-full mt-1 p-2 rounded
                  border border-gray-300
                  bg-blue-50
                  focus:outline-none
                  focus:border-primary-200
                "
              {...register("is_active", {
                validate: (value) =>
                  value === true ||
                  value === false ||
                  "Address status is required",
                setValueAs: (value) => value === "true",
              })}
            >
              <option value="true">Select status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {errors.is_active && (
              <p className="text-red-500 text-xs mt-1">
                {errors.is_active.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              sm:col-span-2
              w-full
              py-2
              rounded
              font-semibold
              text-gray-800
              bg-primary-100
              hover:bg-primary-200
              disabled:opacity-60
              transition
              flex items-center justify-center gap-2
            "
          >
            {isSubmitting && <span className="spinner" />}
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAddressDetails;
