import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UserMobileMenuPage1 from "../pages/UserMobileMenuPage1";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import VerifyEmail from "../pages/VerifyEmail";
import CategoryPage from "../pages/Admin/CategoryPage.jsx";
import SubCategoryPage from "../pages/Admin/SubCategoryPage.jsx"
import Product from "../pages/Admin/Product.jsx"
import UploadProduct from "../pages/Admin/UploadProduct.jsx"
import AdminPermission from "../layout/AdminPermission.jsx";
import RequireAuth from "../layout/RequireAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "user-mobile-menu",
        element: <UserMobileMenuPage1 />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "Profile",
            element: (
              <RequireAuth roles={["ADMIN", "USER"]}>
                <Profile />
              </RequireAuth>
            ),
          },
          {
            path: "myorders",
            element: (
              <RequireAuth roles={["ADMIN", "USER"]}>
                <MyOrders />
              </RequireAuth>
            ),
          },
          {
            path: "address",
            element: (
              <RequireAuth roles={["ADMIN", "USER"]}>
                <Address />
              </RequireAuth>
            ),
          },
          {
            path: "verify-email",
            element: (
              <RequireAuth roles={["ADMIN", "USER"]}>
                <VerifyEmail />
              </RequireAuth>
            ),
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <CategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermission>
                <SubCategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <Product />
              </AdminPermission>
            ),
          },
          {
            path: "uploadproduct",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;