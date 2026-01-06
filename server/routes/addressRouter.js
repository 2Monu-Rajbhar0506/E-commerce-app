import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from "../controllers/address.controller.js";
import { addAddressSchema, deleteAddressSchema, updateAddressSchema } from "../validation/addressValidation.js";
import { validate } from "../middleware/zodValidation.js";

const addressRouter = Router();



addressRouter.post("/create-address", authUser, validate(addAddressSchema), addAddressController);
addressRouter.get("/get", authUser, getAddressController);
addressRouter.put("/update", authUser, validate(updateAddressSchema), updateAddressController);
addressRouter.delete("/delete", authUser, validate(deleteAddressSchema), deleteAddressController);




export default addressRouter;