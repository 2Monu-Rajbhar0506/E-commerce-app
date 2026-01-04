import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/CategoryRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import subCategoryRouter from "./routes/SubCategoryRoutes.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
import orderRouter from "./routes/orderRouter.js";
import { webhookStripe } from "./controllers/orderController.js";

dotenv.config();

const app = express();

/*app.use((req, res, next) => {
  if (req.method !== "GET") {
    console.log(` ${req.method} ${req.url}`);
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
  }
  next();
});*/

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookStripe
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 8080;


app.get("/", (request, response) => {
    //server to client
    response.json({
        message:"server is running ✅"
    })
})


app.use(errorHandler);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running successfully on port✅: http://localhost:${PORT}`);
   });
})



