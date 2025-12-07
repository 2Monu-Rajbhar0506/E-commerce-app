import React from "react";
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin";

//higher order component
const AdminPermission = ({ children }) => {
  const { role} = useSelector((state) => state.user);

  // Handle missing role / unauthenticated user
  if (!role) {
    return (
      <p className="text-red-600 bg-red-100 p-4 rounded">
        You must be logged in to access this page 
      </p>
    );
  }

  // Permission check
  const hasAccess = isAdmin(role);

   //<></> --> fragment tag (i.e: an empty tag)
  return (
    <>
      {hasAccess ? (
        children
      ) : (
        <p className="text-red-600 bg-red-100 p-4 rounded">
          You do not have permission to access this page
        </p>
      )}
    </>
  );
};

export default AdminPermission;



