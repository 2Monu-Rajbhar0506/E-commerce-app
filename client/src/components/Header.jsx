import React,{useEffect, useState} from "react";
import logo from "../assets/logo.png";
import Search1 from "./Search1.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import useMobile from "../hooks/useMobile.jsx";
import { useSelector } from "react-redux";
import { GoTriangleDown,GoTriangleUp  } from "react-icons/go";
import UserMenu from "./UserMenu.jsx";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees.js";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";
import DisplayCartItem from "./Product/DisplayCartItem.jsx";

const Header = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state?.cartItem?.items);
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => navigate("/login");

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("user-mobile-menu");

  }

  return (
    <header className="h-24 lg:h-20 lg:shadow-md  sticky top-0 bg-white z-50 flex flex-col justify-center gap-1">
      {/* NAV BAR - Hidden on mobile search page */}
      {!(isMobile && isSearchPage) && (
        <nav className="container mx-auto flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full">
            <img
              src={logo}
              alt="Website Logo"
              className="w-28 lg:w-44 object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block w-full max-w-xl">
            <Search1 />
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-4 text-gray-700 font-medium">
            {/* Mobile User Icon */}
            <button
              onClick={handleMobileUser}
              className="lg:hidden text-neutral-600 active:scale-95 transition"
              aria-label="Open User Profile"
            >
              <FaUserCircle size={27} />
            </button>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center gap-5 ">
              {user?._id ? (
                <div className="relative ">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer text-gray-800 hover:text-indigo-600 transition"
                  >
                    <p className="font-medium">Account</p>

                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12 z-50">
                      <div className="bg-white rounded-lg p-4 min-w-52 lg:shadow-lg animate-fadeIn">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Login Button */}
                  <button
                    onClick={redirectToLoginPage}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition font-medium"
                  >
                    Login
                  </button>
                </>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setOpenCartSection(true)}
                type="button"
                aria-label="Open Cart"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                <span className="animate-bounce">
                  <FaShoppingCart size={22} />
                </span>

                <div className="font-semibold text-sm">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <span className="leading-tight text-left font-semibold">
                      My Cart
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Search */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search1 />
      </div>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;


/**import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Search1 from "./Search1.jsx";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaHome, FaListUl } from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = 4; // replace with dynamic value later

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ====== NAVBAR ====== }*/
/*<header
        className={`h-24 lg:h-20 fixed top-0 left-0 w-full z-50 flex flex-col justify-center gap-1 transition-all duration-300
        ${isScrolled ? "backdrop-blur-xl bg-white/60 shadow-lg" : "bg-white/40 backdrop-blur-md"} 
      `}
      >
        <div className="container mx-auto flex items-center justify-between h-full px-4">

          {/* Logo }*/
/* <Link to="/" className="flex items-center h-full">
            <img
              src={logo}
              alt="logo"
              className="w-28 lg:w-44 h-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
          </Link>

          {/* Desktop Search }*/
/* <div className="hidden lg:block w-full max-w-xl">
            <Search1 />
          </div>

          {/* Login + Cart} */
/* <div className="flex items-center gap-4 text-gray-700">
            {/* Profile / User} */
/* <button className="lg:hidden text-neutral-700 active:scale-95 transition">
              <FaUserCircle size={26} />
            </button>

            {/* Desktop login + cart }*/
/* <div className="hidden lg:flex items-center gap-5">
              <button className="hover:text-primary-200 transition">Login</button>

              <div className="relative cursor-pointer hover:scale-105 transition">
                <FaShoppingCart size={23} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search }*/
/*<div className="container mx-auto px-2 lg:hidden">
          <Search1 />
        </div>
      </header>

      {/* ====== MOBILE BOTTOM NAVIGATION ====== }*/
/* <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-3px_10px_rgba(0,0,0,0.1)] flex justify-around py-2 text-gray-600 z-50">
        <Link className="flex flex-col items-center active:scale-95">
          <FaHome size={22} />
          <span className="text-[11px]">Home</span>
        </Link>
        <Link className="flex flex-col items-center active:scale-95">
          <FaListUl size={22} />
          <span className="text-[11px]">Categories</span>
        </Link>
        <Link className="flex flex-col items-center active:scale-95 relative">
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-3 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
              {cartCount}
            </span>
          )}
          <span className="text-[11px]">Cart</span>
        </Link>
        <Link className="flex flex-col items-center active:scale-95">
          <FaUserCircle size={22} />
          <span className="text-[11px]">Account</span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
 */
