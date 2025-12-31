import React, { useState } from "react";
import EditProductAdmin from "../Product/EditProductAdmin";
import ConfirmDeleteBox from "./ConfirmDeleteBox";
import AxiosToastError from "../../utils/AxiosToastError";
import SummaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";
import api from "../../utils/Axios";

const ProductCardAdmin = ({ data, fetchProduct }) => {

  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false);



  const handleDelete = async () => {
    if (!data?._id) {
      toast.error("Invalid Product");
      return;
    }

    try {
      setDeleting(true);

      const response = await api({
        ...SummaryApi.deleteProduct(data?._id),
      })

      const { data: responseData } = response;
      
      if (responseData?.success) {
        toast.success(responseData.message || "Product deleted");
        if (fetchProduct) {
          fetchProduct()
        };
        setOpenDelete(false);
      } else {
        toast.error(responseData?.message || "Failed to delete product");
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white self-start rounded-lg shadow hover:shadow-md transition p-3 flex flex-col gap-3">
      {/* Image */}
      <div className="w-full h-36 flex items-center justify-center bg-gray-50 rounded">
        <img
          src={data?.image?.[0]}
          alt={data?.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div>
        <p className="font-semibold text-sm line-clamp-2">{data?.name}</p>
        <p className="text-xs text-gray-500 mt-1">{data?.unit}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => setEditOpen(true)}
          className="text-sm px-2 py-1 rounded border border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
        >
          Edit
        </button>

        <button
          onClick={() => setOpenDelete(true)}
          disabled={deleting}
          className="text-sm px-2 py-1 rounded border border-red-600 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition"
        >
          Delete
        </button>
      </div>

      {editOpen && (
        <EditProductAdmin
          Data={data}
          close={() => setEditOpen(false)}
          fetchProduct={fetchProduct}
        />
      )}

      {openDelete && (
        <ConfirmDeleteBox
          close={() => setOpenDelete(false)}
          cancel={() => setOpenDelete(false)}
          confirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductCardAdmin;
