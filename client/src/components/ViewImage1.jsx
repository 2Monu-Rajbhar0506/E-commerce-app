import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";

const ViewImage1 = ({ url, close }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-4 overflow-auto max-h-[85vh] border border-neutral-200">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
            <MdZoomOutMap className="text-amber-600" size={22} />
            Image Preview
          </h2>

          <button
            onClick={close}
            aria-label="Close image"
            className="text-red-500 hover:text-red-600 transition transform hover:scale-110"
          >
            <IoMdCloseCircle size={32} />
          </button>
        </div>

        {/* Image */}
        <div className="pt-4 flex justify-center">
          <img
            src={url}
            alt="Preview"
            className="rounded-lg shadow-md max-h-[70vh] object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default ViewImage1;
