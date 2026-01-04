import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();



addressRouter.post("/create-address", authUser, addAddressController);
addressRouter.get("/get", authUser, getAddressController);
addressRouter.put("/update", authUser, updateAddressController);
addressRouter.delete("/delete", authUser, deleteAddressController);




export default addressRouter;