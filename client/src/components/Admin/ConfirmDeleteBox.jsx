import React from 'react'
import { MdOutlineCancel } from "react-icons/md";

const ConfirmDeleteBox = ({cancel, confirm, close}) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/70 p-4 flex justify-center items-center ">
      <div className="bg-white w-full max-w-md p-4 rounded-md">
        <div className="flex justify-between items-center gap-3 ">
          <h1 className="font-semibold">Permanent Delete</h1>
          <button onClick={close}>
            <MdOutlineCancel size={25} />
          </button>
        </div>
        <p className="my-4">Are you sure you want to delete permanently ?</p>

        <div className="flex items-center gap-8">
          <button
            onClick={cancel}
            className="flex-1 font-medium border border-red-600 hover:bg-red-700 hover:text-white p-2 text-xs text-red-500 rounded shadow-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={confirm}
            className="flex-1 font-medium border border-green-600 hover:bg-green-700 hover:text-white p-2 text-xs text-green-500 rounded shadow-md transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteBox
