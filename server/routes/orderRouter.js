import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { cancelOrder, CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", authUser, CashOnDeliveryOrderController);
orderRouter.post("/checkout", authUser, paymentController);
orderRouter.get("/get", authUser, getOrderDetailsController);
orderRouter.post("/cancel", authUser, cancelOrder);


export default orderRouter;