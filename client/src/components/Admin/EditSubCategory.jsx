import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import UploadImage from "../../utils/UploadImage.js";
import api from "../../utils/Axios.js";
import SummaryApi from "../../common/summaryApi.js";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError.js";

const EditSubCategory = ({ close,data, fetchData }) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.categories || [],
  });

  const allCategory = useSelector((state) => state.product.allCategory);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubCategoryUploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploadLoading(true);

      const response = await UploadImage(file);
      const { data: ImageResponse } = response;

      if (!ImageResponse?.secure_url) {
        throw new Error("Invalid upload response");
      }

      setSubCategoryData((prev) => ({
        ...prev,
        image: ImageResponse.secure_url,
      }));
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setUploadLoading(false);
    }
  };


  const handleCategory = (e) => {
    const categoryId = e.target.value;

    if (!categoryId) return;

    const categoryObject = allCategory.find((el) => el._id === categoryId);

    // Prevent duplicates
    const alreadyExists = subCategoryData.category.some(
      (el) => el._id === categoryId
    );

    if (alreadyExists) return;

    setSubCategoryData((prev) => ({
      ...prev,
      category: [...prev.category, categoryObject],
    }));
  };


  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((el) => el._id !== categoryId),
    }));
  };

  /**  //OR 
  const handleRemoveCategorySelected = (categoryId) => {
    const Index = subCategoryData.category.findIndex(el => el._id === categoryId);
    console.log("Index", Index);
    subCategoryData.category.splice(Index, 1); //this splice() will remove 1 element from "Index" and modify the "subCategoryData" 
    setSubCategoryData((prev) => {
      return { ...prev }
    }); 
  }*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);

     const payload = {
       _id:subCategoryData._id,
       name: subCategoryData.name,
       image: subCategoryData.image,
       categories: subCategoryData.category.map((cat) => cat._id),
     };

     const response = await api({
       ...SummaryApi.updateSubCategory,
       data: payload,
     });

     // console.log(response);
      
      const { data: responseData } = response;

      if (responseData?.success) {

        toast.success(responseData.message);
        if (close) {
          close()
        }
        if(fetchData){
            fetchData()
        }
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }
  
  
  return (
    <section className="fixed inset-0 bg-neutral-800/70 flex items-center justify-center p-4 pt-30 ">
      <div className="w-full max-w-5xl bg-white p-5 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Edit Sub Category</h1>
          <button
            className="text-neutral-600 hover:text-neutral-900"
            onClick={close}
          >
            <IoIosCloseCircleOutline size={28} />
          </button>
        </div>

        {/* Form */}
        <form className="mt-5 grid gap-5" onSubmit={handleSubmit}>
          {/* NAME INPUT */}
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={subCategoryData.name}
              placeholder="Enter your name"
              onChange={handleChange}
              className="p-3 bg-blue-50 border border-gray-300 shadow-sm outline-none focus:border-primary-200 rounded-xl"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="grid gap-2">
            <label>Image</label>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="lg:w-36 w-full h-36 bg-blue-50 border border-gray-300 shadow-sm rounded flex items-center justify-center overflow-hidden">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="Sub Category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-400">No Image</p>
                )}
              </div>

              <label htmlFor="file">
                <div className="px-5 py-2 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer transition">
                  {uploadLoading ? "Uploading..." : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleSubCategoryUploadImage}
                />
              </label>
            </div>
          </div>

          {/* CATEGORY SELECTION */}
          <div className="grid gap-2">
            <label>Select Category</label>

            {/* SELECTED TAGS */}
            <div className="flex flex-wrap gap-2 mb-1">
              {subCategoryData.category.map((cat) => (
                <p
                  key={cat._id}
                  className="bg-yellow-300/60 shadow-sm px-2 py-1 rounded flex items-center gap-2"
                >
                  {cat.name}
                  <span
                    className="cursor-pointer"
                    onClick={() => handleRemoveCategorySelected(cat._id)}
                  >
                    <IoMdCloseCircleOutline size={18} />
                  </span>
                </p>
              ))}
            </div>

            {/* DROPDOWN */}
            <select
              onChange={handleCategory}
              defaultValue=""
              className="w-full p-3 bg-transparent border border-gray-400/70 rounded-xl outline-none text-gray-500"
            >
              <option value={""}>
                Select Category
              </option>

              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>


          <button
            type="submit"
            className={`px-4 py-2 border border-transparent cursor-pointer
            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-amber-400 hover:bg-amber-500 transition": "bg-gray-300 hover:bg-gray-400 transition"  }
             font-semibold rounded-xl 
           `}>
            {loading ? "Submitting ...":"Submit"}
          </button>



        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;





