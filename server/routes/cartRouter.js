import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { addToCartItemController, decrementCartItemQtyController, getCartItemController, incrementCartItemQtyController, updateCartItemQtyController } from "../controllers/cartProductController.js";
import { addToCartSchema, decrementCartQtySchema, incrementCartQtySchema, updateCartQtySchema } from "../validation/cartProductValidation.js";
import { validate } from "../middleware/zodValidation.js";

const cartRouter = Router();


cartRouter.post("/add-To-cart", authUser, validate(addToCartSchema), addToCartItemController);
cartRouter.get("/get", authUser, getCartItemController);
cartRouter.put("/update-cart-qty", authUser, validate(updateCartQtySchema), updateCartItemQtyController);
cartRouter.put("/increment-cart-item", authUser, validate(incrementCartQtySchema), incrementCartItemQtyController);
cartRouter.put("/decrement-cart-item", authUser, validate(decrementCartQtySchema), decrementCartItemQtyController);

export default cartRouter;