import React from "react";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";

const UserMobileMenuPage1 = ({ onClose }) => {
  return (
    <section className="bg-white h-full w-full py-4 shadow-lg">
      {/* Close Button */}
      <div className="flex justify-end px-4">
        <button
          onClick={()=> window.history.back()}
          className="text-gray-700 hover:text-gray-900 transition"
        >
          <IoClose size={28} />
        </button>
      </div>

      {/* User Menu */}
      <div className="container mx-auto px-4 mt-2">
        <UserMenu />
      </div>
    </section>
  );
};

export default UserMobileMenuPage1;
