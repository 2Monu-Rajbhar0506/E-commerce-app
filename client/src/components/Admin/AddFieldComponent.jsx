import React from 'react'
import { IoClose } from "react-icons/io5";

/*const AddFieldComponent = ({close,value,onChange,submit}) => {
  return (
    <section className='fixed inset-0 bg-neutral-900/70 z-50 flex justify-center items-center p-4'>    
          <div className='bg-white rounded p-4 w-full max-w-md'>
              <div className='flex items-center justify-between gap-3'>
                  <h1>Add Field</h1>
                  <button onClick={close}>
                      <IoClose size={25} />
                  </button>
              </div>
              <input
                  className='bg-blue-100 p-2 my-3 border outline-none border-blue-50 focus-within:border-primary-200 rounded w-full'
                  placeholder='Enter your field'
                  value={value}
                  onChange={onChange}
              />
              <button
                  onClick={submit}
                  className='bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block'>
                  Add Field
              </button>
          </div>
    </section>
  )
}*/


const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <h1 className="text-lg font-semibold text-gray-800">Add New Field</h1>
          <button
            onClick={close}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter field name"
          value={value}
          onChange={onChange}
          className="w-full mt-4 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
        />

        {/* Button */}
        <button
          onClick={submit}
          className="mt-5 w-full bg-primary-200 hover:bg-primary-100 text-white font-semibold py-2.5 rounded-lg shadow-sm transition"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};



export default AddFieldComponent
