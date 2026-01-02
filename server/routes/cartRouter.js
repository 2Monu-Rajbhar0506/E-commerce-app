import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { addToCartItemController, decrementCartItemQtyController, getCartItemController, incrementCartItemQtyController, updateCartItemQtyController } from "../controllers/cartProductController.js";

const cartRouter = Router();


cartRouter.post("/add-To-cart", authUser, addToCartItemController);
cartRouter.get("/get", authUser, getCartItemController); 
cartRouter.put("/update-cart-qty", authUser, updateCartItemQtyController);
cartRouter.put("/increment-cart-item", authUser, incrementCartItemQtyController);
cartRouter.put("/decrement-cart-item", authUser, decrementCartItemQtyController);

export default cartRouter;