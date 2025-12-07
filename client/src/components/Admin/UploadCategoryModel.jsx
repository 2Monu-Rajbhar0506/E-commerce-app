import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import UploadImage from "../../utils/UploadImage";
import { MdCloudUpload } from "react-icons/md";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";

const UploadCategoryModel = ({ close, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploadLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    image: "",
  });

  /**[name]: value
This means:
 Use the input’s name="" as the key.
So:
If the input name is "name" → update data.name
If the input name is "image" → update data.image
If the input name is "email" → update data.email
(even if the field didn’t exist before!)

FINAL ANSWER (simple)
 name: value
Always updates only the name field.

 [name]: value
Updates whatever field the input belongs to.
This is why React forms must use [name]: value for dynamic forms. */

  const handleOnChange = (e) => {
    const { name, value } = e.target; //this name and value is coming from input

    setData((prev) => {
      return {
        ...prev,
        [name]: value, //this name is the name of input,It means update the correct field based on the input’s name.
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!data.name.trim() || !data.image) {
       toast.error("Please fill all fields");
       return;
     }


    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.addCategory,
        data: data,
      });

      const responseData = response.data;

      if (responseData.success) {
        toast.success(responseData.message);
        // reset
        setData({ name: "", image: "" });
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {

    if (!data.name) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploadLoading(true);

      const response = await UploadImage(file);
      const { data: ImageResponse } = response;

      if (!ImageResponse?.secure_url) {
        throw new Error("Invalid upload response");
      }

      setData((prev) => ({
        ...prev,
        image: ImageResponse.secure_url, // correct
      }));
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-neutral-800/70 flex justify-center items-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-md p-6">
        {/*Heading & button*/}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Add Category</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <IoCloseCircleOutline size={25} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="my-3 grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="Category">Name</label>
            <input
              id="Category"
              type="text"
              placeholder="Enter Category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus:border-primary-200 focus:outline-none rounded"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>

            <div className="flex gap-4 flex-col lg:flex-row items-center">
              {/* Preview */}
              <div className="border bg-blue-50 w-full h-36 lg:w-36 flex items-center justify-center border-blue-100 rounded overflow-hidden">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">
                    {" "}
                    <span className="flex justify-center">
                      <MdCloudUpload size={25} />
                    </span>{" "}
                    Upload Image
                  </p>
                )}
              </div>

              {/* Upload Button */}
              {/**Why <button> is not used
                  <input type="file"> cannot be styled properly. Browsers do not allow full styling of a file input.
                  So the standard professional pattern is:
                  Hide the real <input type="file">
                  Use a <label> as the visible button
                  When the label is clicked → it automatically triggers the hidden file input
                  (htmlFor="uploadCategoryImage" connects them)
                  This is the best practice in React, Tailwind, and modern UI libraries. */}
              <label
                className={uploading || !data.name.trim() ? "pointer-events-none" : ""} //prevents accidental clicking
                htmlFor="uploadCategoryImage"
              >
                <div
                  className={`
                      px-4 py-2 rounded-2xl text-gray-700 text-center border border-primary-200
                      ${
                        uploading
                          ? "bg-gray-300 cursor-not-allowed"
                          : !data.name.trim()
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-amber-100 hover:bg-primary-200 cursor-pointer font-medium"
                      }
                    `}
                >
                  {uploading ? "Uploading Image..." : "Upload Image"}
                </div>

                {/* Hidden input */}
                <input
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadCategoryImage}
                  disabled={uploading || !data.name.trim()}
                />
              </label>
            </div>
          </div>

          <button
            disabled={!data.name.trim() || !data.image || loading}
            type="submit"
            className={`${
              data.name && data.image
                ? "bg-primary-100 hover:bg-amber-400 transition"
                : "bg-gray-300"
            } py-2 font-semibold rounded-2xl`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Adding...
              </span>
            ) : (
              "Add Category"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
