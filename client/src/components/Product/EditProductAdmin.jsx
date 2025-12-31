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
import { IoClose } from "react-icons/io5";


const EditProductAdmin = ({ Data, close, fetchProduct }) => {

    const [data, setData] = useState({
        _id: Data._id,
        name: Data.name,
        image: Data.image || [],
        category: Data.category || [],
        subCategory: Data.subCategory || [],
        unit: Data.unit,
        stock: Data.stock,
        price: Data.price,
        discount: Data.discount,
        description: Data.description,
        more_details: Data.more_details || {},
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("FINAL PRODUCT DATA:", data);

        if (loading) return; //prevent the multiple submits

        setLoading(true);

        try {
            const payload = {
                ...data,
                category: data.category.map((c) => c._id),
                subCategory: data.subCategory.map((s) => s._id),
            };

            const response = await api({
                ...SummaryApi.updateProductDetails(Data._id),
                data: payload,
            });

            const { data: responseData } = response;

            if (responseData.success) {
                successAlert(responseData.message);
                if (close) {
                    close();
                }
                fetchProduct();
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
            AxiosToastError(error);
        } finally {
            setLoading(false); //finally will always stop the loader
        }
    };

    const removeField = (key) => {
        setData((prev) => {
            const updated = { ...prev.more_details };
            delete updated[key];

            return {
                ...prev,
                more_details: updated,
            };
        });
    };


    return (
        <section className="fixed inset-0 bg-black/80 z-50 p-4">
            <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
                <section className="min-h-screen bg-gray-50 py-6 px-3 max-w-full">
                    <div className="max-w-full mx-auto bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
                        {/* HEADER */}
                        <div className="px-5 py-4 border-b bg-gray-100 flex items-center justify-between">
                            <h2 className="font-semibold text-lg text-gray-900">
                                Upload Product
                            </h2>
                            <button onClick={close} className="bg-gray-300 rounded-full p-1 hover:bg-gray-400 hover:text-white">
                                <IoClose size={20} />
                            </button>
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
                                    <label className="font-medium text-gray-700">
                                        Sub Category
                                    </label>
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
                                        <label
                                            htmlFor="stock"
                                            className="font-medium text-gray-700"
                                        >
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
                                        <label
                                            htmlFor="Number"
                                            className="font-medium text-gray-700"
                                        >
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
                                        <label
                                            htmlFor="discount"
                                            className="font-medium text-gray-700"
                                        >
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
                                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-primary-200 hover:bg-primary-100"
                                        }`}
                                >
                                    {loading ? "Processing..." : "Update Product"}
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
            </div>
        </section>
    );
};

export default EditProductAdmin

















