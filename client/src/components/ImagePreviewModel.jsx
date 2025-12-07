import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ImagePreviewModal = ({ src, close }) => {
    if (!src) {
        return null;
    }

    return (
      <section className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative max-w-[90%] max-h-[90%]">
          {/**close button */}
          <button
            onClick={close}
            className="absolute top-2 right-2 bg-white/80 rounded-full px-3 py-1 text-sm text-neutral-600 hover:text-neutral-800"
          >
            <IoMdCloseCircleOutline size={25} />
          </button>

          <img
            src={src}
            alt="Preview"
            className="rounded-lg shadow-lg object-contain max-w-[80vw] max-h-[80vh]"
          />
        </div>
      </section>
    );
}

export default ImagePreviewModal;