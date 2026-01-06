import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { cancelOrder, CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from "../controllers/orderController.js";
import { validate } from "../middleware/zodValidation.js";
import { cancelOrderSchema, cashOnDeliverySchema, stripePaymentSchema } from "../validation/orderValidation.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", authUser, validate(cashOnDeliverySchema), CashOnDeliveryOrderController);
orderRouter.post("/checkout", authUser, validate(stripePaymentSchema), paymentController);
orderRouter.get("/get", authUser, getOrderDetailsController);
orderRouter.post("/cancel", authUser, validate(cancelOrderSchema), cancelOrder);


export default orderRouter;