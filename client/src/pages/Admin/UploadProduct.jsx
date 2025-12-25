/*import React,{useState} from 'react'
import { MdCloudUpload, MdDelete } from "react-icons/md";
import uploadImage from '../../utils/UploadImage';
import Loader from "../../components/Loader.jsx"
import AxiosToastError from '../../utils/AxiosToastError.js';
import ViewImage1 from "../../components/ViewImage1.jsx"
import { useSelector } from 'react-redux';
import { IoIosClose } from "react-icons/io";
import AddFieldComponent from '../../components/Admin/AddFieldComponent.jsx';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [selectCategory, setSelectCategory] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageUrl, setViewImageUrl] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        return;
      }

      setImageLoading(true);

      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      const imageUrl = ImageResponse?.url;

      setData((prev) => {
        return {
          ...prev,
          image: [...prev.image, imageUrl],
        };
      });
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCategory = (index) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };
  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  //OR
  // const handleRemoveCategory = (index) => {
  //   data.category.splice(index, 1)
  //   setData((prev) => {
  //     return {
  //       ...prev
  //     }
  //   })
  // }

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    const category = allCategory.find((el) => el._id === value);
    if (!category) return;

    setData((prev) => {
      // Check duplicates inside selected categories
      const alreadyExists = prev.category.some((c) => c._id === value);
      if (alreadyExists) return prev;

      return {
        ...prev,
        category: [...prev.category, category],
      };
    });

    // Reset dropdown to placeholder
    setSelectCategory("");
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    const subCategory = allSubCategory.find((el) => el._id === value);
    if (!subCategory) return;

    setData((prev) => {
      // Check duplicates inside selected categories
      const alreadyExists = prev.subCategory.some((c) => c._id === value);
      if (alreadyExists) return prev;

      return {
        ...prev,
        subCategory: [...prev.subCategory, subCategory],
      };
    });

    // Reset dropdown to placeholder
    setSelectSubCategory("");
  };

  /**handleAddField dynamically adds a new key–value pair inside the more_details object of your data state.
     The new key is whatever the user typed in fieldName, and its value is an empty string ("").
     So you're basically doing:
     Add new field
     With empty value
     Without deleting existing data */
  /*const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  /***This function updates a specific dynamic field inside the more_details object when the user types something in an input */
  /*const handleChangeAddField = (e,k) => {
    const value = e.target.value;
    //console.log("Value", value);
    
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [k]: value,
        },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("data",data);
    
  }


  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div className="grid gap-1 p-3">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="Name" className="font-medium">
              Name
            </label>
            <input
              id="Name"
              type="text"
              placeholder="Enter product name"
              value={data.name}
              name="name"
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              type="text"
              placeholder="Enter product description"
              value={data.description}
              name="description"
              onChange={handleChange}
              required
              multiple
              rows={4}
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded resize-none"
            />
          </div>

          <div>
            <p className="font-medium">Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 rounded flex justify-center items-center cursor-pointer outline-none border border-dashed border-gray-300"
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <MdCloudUpload size={35} color="gray" />
                      <p className="text-gray-600">Upload Image</p>
                    </>
                  )}
                </div>

                <input
                  id="productImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>

              <div className="mt-2 flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className=" relative group h-24 w-24 rounded-lg border bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setViewImageUrl(img)}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Category</label>
            <div>
              <select
                value={selectCategory}
                onChange={handleCategoryChange}
                className="bg-blue-50 border w-full p-2 rounded"
              >
                <option value={""} className="text-neutral-600">
                  {" "}
                  Select Category{" "}
                </option>
                {allCategory.map((c, index) => {
                  return (
                    <option value={c?._id} key={index + 1}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-3 ">
                {data.category.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productSection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <button
                        onClick={() => handleRemoveCategory(index)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <IoIosClose size={25} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Sub Category</label>
            <div>
              <select
                value={selectSubCategory}
                onChange={handleSubCategoryChange}
                className="bg-blue-50 border w-full p-2 rounded"
              >
                <option value={""} className="text-neutral-600">
                  {" "}
                  Select Sub Category{" "}
                </option>
                {allSubCategory.map((c, index) => {
                  return (
                    <option value={c?._id} key={index + 1}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-3 ">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productSection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        onClick={() => handleRemoveSubCategory(index)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <IoIosClose size={25} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="unit" className='font-medium'>Unit</label>
            <input
              id="unit"
              type="text"
              placeholder="Enter product unit"
              value={data.unit}
              name="unit"
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="stock" className='font-medium'>Number of Stock</label>
            <input
              id="stock"
              type="number"
              placeholder="Enter product stock"
              value={data.stock}
              name="stock"
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="price" className='font-medium'>Price</label>
            <input
              id="price"
              type="number"
              placeholder="Enter product price"
              value={data.price}
              name="price"
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="discount" className='font-medium'>Discount</label>
            <input
              id="discount"
              type="number"
              placeholder="Enter product discount"
              value={data.discount}
              name="discount"
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
            />
          </div>

       
          <div>
            {Object?.keys(data?.more_details)?.map((k, index) => {
              return (
                <div key={index + 1} className="grid gap-1">
                  <label htmlFor={k} className='font-medium'>{k}</label>
                  <input
                    id={k}
                    type="text"
                    placeholder={`Enter ${k}`}
                    value={data?.more_details[k]}
                    onChange={(e) => handleChangeAddField(e, k)}
                    required
                    className="bg-blue-50 p-2 outline-none border-blue-50 border focus:border-primary-200 rounded"
                  />
                </div>
              );
            })}
          </div>
          <div
            onClick={() => setOpenAddField(true)}
            className="hover:bg-primary-200 hover:text-white bg-white py-1 px-3 w-32 text-center font-semibold rounded border border-primary-200 cursor-pointer transition"
          >
            Add Fields
          </div>

          <button
           className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
          >
            Submit
          </button>
        </form>
      </div>

      {ViewImageUrl.trim() && (
        <ViewImage1 url={ViewImageUrl} close={() => setViewImageUrl("")} />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
}

export default UploadProduct*/






import React, { useEffect, useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import uploadImage from "../../utils/UploadImage";
import Loader from "../../components/Loader";
import AxiosToastError from "../../utils/AxiosToastError";
import ViewImage1 from "../../components/ViewImage1";
import AddFieldComponent from "../../components/Admin/AddFieldComponent";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import successAlert from "../../utils/SuccessAlert";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- Handlers ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setImageLoading(true);

      const response = await uploadImage(file);
      const imageUrl = response?.data?.url;

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl],
      }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    if (!id) return;

    const selected = allCategory.find((c) => c._id === id);
    if (!selected) return;

    if (data.category.some((c) => c._id === id)) return;

    setData((prev) => ({
      ...prev,
      category: [...prev.category, selected],
    }));

    setSelectCategory("");
  };

  const handleRemoveCategory = (index) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handleSubCategoryChange = (e) => {
    const id = e.target.value;
    if (!id) return;

    const selected = allSubCategory.find((c) => c._id === id);
    if (!selected) return;

    if (data.subCategory.some((c) => c._id === id)) return;

    setData((prev) => ({
      ...prev,
      subCategory: [...prev.subCategory, selected],
    }));

    setSelectSubCategory("");
  };

  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));

    setFieldName("");
    setOpenAddField(false);
  };

  const handleChangeAddField = (e, key) => {
    const value = e.target.value;

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [key]: value,
      },
    }));
  };

  // useEffect(() => {
  //   successAlert("Product uploaded")
  // }, []);

  const handleSubmit = async(e) => {
     e.preventDefault();
    // console.log("FINAL PRODUCT DATA:", data);

    if (loading) return; //prevent the multiple submits
    
    setLoading(true);


    try {
      const payload = {
        ...data,
        category: data.category.map((c) => c._id),
        subCategory: data.subCategory.map((s) => s._id),
     }


      const response = await api({
        ...SummaryApi.createProduct,
        data: payload,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message)


        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false);  //finally will always stop the loader
    }
  };

  const removeField = (key) => {
    setData((prev) => {
      const updated = { ...prev.more_details };
      delete updated[key];

      return {
        ...prev,
        more_details: updated
      }
    })
  };

  
  // ---------------- UI ----------------

  return (
    <section className="min-h-screen bg-gray-50 py-6 px-3 max-w-full">
      <div className="max-w-full mx-auto bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {/* HEADER */}
        <div className="px-5 py-4 border-b bg-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900">
            Upload Product
          </h2>
        </div>

        {/* FORM */}
        <div className="p-5">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {/* PRODUCT NAME */}
            <div>
              <label htmlFor="name" className="font-medium text-gray-700">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter product description"
                required
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition resize-none"
              />
            </div>

            {/* IMAGES */}
            <div>
              <p className="font-medium text-gray-700">Images</p>

              <label
                htmlFor="productImage"
                className="h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col justify-center items-center cursor-pointer hover:bg-white hover:border-primary-200 transition"
              >
                {imageLoading ? (
                  <Loader />
                ) : (
                  <>
                    <MdCloudUpload size={40} className="text-gray-500" />
                    <p className="text-gray-600 text-sm">Click to upload</p>
                  </>
                )}
                <input
                  id="productImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>

              <div className="flex flex-wrap gap-3 mt-3">
                {data.image.map((img, index) => (
                  <div
                    key={index + 1}
                    className="relative group h-24 w-24 rounded-lg border bg-gray-100 overflow-hidden"
                  >
                    <img
                      src={img}
                      alt="preview"
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => setViewImageUrl(img)}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="font-medium text-gray-700">Category</label>
              <select
                value={selectCategory}
                onChange={handleCategoryChange}
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
              >
                <option value="">Select Category</option>
                {allCategory.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {data.category.map((c, index) => (
                  <div
                    key={index + 1}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {c.name}
                    <IoIosClose
                      className="cursor-pointer hover:text-red-500"
                      size={20}
                      onClick={() => handleRemoveCategory(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SUB CATEGORY */}
            <div>
              <label className="font-medium text-gray-700">Sub Category</label>
              <select
                value={selectSubCategory}
                onChange={handleSubCategoryChange}
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
              >
                <option value="">Select Sub Category</option>
                {allSubCategory.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {data.subCategory.map((s, index) => (
                  <div
                    key={index + 1}
                    className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                  >
                    {s.name}
                    <IoIosClose
                      className="cursor-pointer hover:text-red-500"
                      size={20}
                      onClick={() => handleRemoveSubCategory(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* STOCK | PRICE | DISCOUNT */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* STOCK */}
              <div>
                <label htmlFor="stock" className="font-medium text-gray-700">
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
                />
              </div>

              {/* PRICE */}
              <div>
                <label htmlFor="Number" className="font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  id="Number"
                  type="number"
                  name="price"
                  value={data.price}
                  placeholder="0"
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
                />
              </div>

              {/**UNIT */}
              <div>
                <label htmlFor="Unit" className="font-medium text-gray-700">
                  Unit
                </label>
                <input
                  id="Unit"
                  type="text"
                  name="unit"
                  value={data.unit}
                  placeholder="Enter unit"
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
                />
              </div>

              {/* DISCOUNT */}
              <div>
                <label htmlFor="discount" className="font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  id="discount"
                  type="number"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
                />
              </div>
            </div>

            {/* DYNAMIC FIELDS */}
            <div className="grid gap-3">
              {Object.keys(data.more_details).map((key) => (
                <div key={key} className="grid gap-1 relative">
                  <label className="font-medium text-gray-700">{key}</label>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={data.more_details[key]}
                      onChange={(e) => handleChangeAddField(e, key)}
                      placeholder={`Enter ${key}`}
                      className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition"
                    />

                    {/* Delete Button for Each Field */}
                    <button
                      type="button"
                      onClick={() => removeField(key)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <MdDeleteOutline size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD FIELDS BUTTON */}
            <button
              type="button"
              onClick={() => setOpenAddField(true)}
              className="py-2 border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white rounded-lg font-semibold transition w-32"
            >
              Add Fields
            </button>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed": "bg-primary-200 hover:bg-primary-100"}`}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {viewImageUrl && (
        <ViewImage1 url={viewImageUrl} close={() => setViewImageUrl("")} />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
