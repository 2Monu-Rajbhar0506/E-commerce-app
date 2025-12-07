import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: true,
      unique: true,
    },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "cashfree", "cod"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
    },

    receipt_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
