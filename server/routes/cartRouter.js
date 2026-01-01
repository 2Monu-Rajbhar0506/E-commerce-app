import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { addToCartItemController, getCartItemController } from "../controllers/cartProductController.js";

const cartRouter = Router();


cartRouter.post("/add-To-cart", authUser, addToCartItemController);
cartRouter.get("/get", authUser, getCartItemController); 


export default cartRouter;