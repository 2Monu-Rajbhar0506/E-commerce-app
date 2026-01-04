import Address from "../models/addressModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const addAddressController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.userId;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Unauthorized User", 401);
    }

    const { address_line, city, state, pincode, country, mobile, is_active } = req.body;

    // validation
    if (
      !address_line?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !country?.trim() ||
      !pincode ||
      !mobile
    ) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "All address fields are required", 400);
    }

    if (!/^\d{6}$/.test(pincode)) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid pincode", 400);
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid mobile number", 400);
    }

    // create address
    const [address] = await Address.create(
      [
        {
          address_line,
          city,
          state,
          country,
          pincode,
          mobile,
          userId,
          is_active,
        },
      ],
      { session }
    );

    // attach address to user
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { address_details: address._id },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

      return successResponse(res, "Address created successfully", address, 201);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error("Add Address Error:", error);
    return errorResponse(res, "Failed to create address", 500);
  }
};

export const getAddressController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized User", 401);
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });


    return successResponse(res, "Address list fetched successfully", addresses, 200);

  } catch (error) {
     console.error("Get Address Error:", error);
     return errorResponse(res, error.message || "Failed to fetch addresses", 500);
  }
}


export const updateAddressController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized user", 401);
    }

    const {
      _id,
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      is_active,
    } = req.body;

    // validate address id
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return errorResponse(res, "Invalid address id", 400);
    }

    // validation
    if (
      !address_line?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !country?.trim() ||
      !pincode ||
      !mobile
    ) {
      return errorResponse(res, "All address fields are required", 400);
    }

    if (!/^\d{6}$/.test(pincode)) {
      return errorResponse(res, "Invalid pincode", 400);
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return errorResponse(res, "Invalid mobile number", 400);
    }

    // update address (only if it belongs to user)
    const updatedAddress = await Address.findOneAndUpdate(
      { _id, userId },
      {
        address_line,
        city,
        state,
        country,
        pincode,
        mobile,
        is_active,
      },
      {
        new: true, // return updated document
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return errorResponse(res, "Address not found", 404);
    }

    return successResponse(
      res,
      "Address updated successfully",
      updatedAddress,
      200
    );
  } catch (error) {
    console.error("Update Address Error:", error);
    return errorResponse(res, "Failed to update address", 500);
  }
};


export const deleteAddressController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.userId;
    if (!userId) {
      return errorResponse(res, "Unauthorized user", 401);
    }

    const { _id } = req.body;
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return errorResponse(res, "Invalid address id", 400);
    }

    const deletedAddress = await Address.findOneAndDelete(
      { _id, userId },
      { session }
    );

    if (!deletedAddress) {
      await session.abortTransaction();
      return errorResponse(res, "Address not found", 404);
    }

    await User.updateOne(
      { _id: userId },
      { $pull: { address_details: _id } },
      { session }
    );

    // If deleted address was active
    if (deletedAddress.is_active) {
      // Find another address for the same user
      // If the user deletes the active address,
      // automatically make the most recently added address active.
      const anotherAddress = await Address.findOne(
        { userId },
        {},
        { sort: { createdAt: -1 }, session }
      );
      // If another address exists, activate it
      if (anotherAddress) {
        await Address.updateOne(
          { _id: anotherAddress._id },
          { $set: { is_active: true } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      "Address permanently deleted",
      deletedAddress,
      200
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete Address Error:", error);
    return errorResponse(res, "Failed to delete address", 500);
  }
};
