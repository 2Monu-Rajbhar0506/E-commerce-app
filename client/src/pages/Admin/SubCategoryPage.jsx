import React, { useEffect, useState } from "react";
import UploadSubCategory from "../../components/Admin/UploadSubCategory";
import AxiosToastError from "../../utils/AxiosToastError";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import DisplayTable from "../../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage1 from "../../components/ViewImage1";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditSubCategory from "../../components/Admin/EditSubCategory";
import ConfirmDeleteBox from "../../components/Admin/ConfirmDeleteBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageUrl, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });

  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);



  const fetchSubcategory = async (req, res) => {
    try {
      setLoading(true);
      const response = await api({
        ...SummaryApi.getSubCategory,
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategory();
  }, []);

  // console.log("Subcategory",data);

  ////rules for how to show each column
  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),

    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        //console.log("row",);
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-10 h-10 cursor-pointer"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("categories", {
      header: "Category",
      cell: ({ row }) => {
        //console.log("category row",row.original);
        return (
          <>
            {row.original.categories.map((c, index) => {
              return (
                <p
                  key={c._id + "table"}
                  className="shadow-md px-1 inline-block bg-gray-100"
                >
                  {c.name}
                </p>
              );
            })}
          </>
        );
      },
    }),

    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex item-center justify-center gap-3 ">
            <button
              onClick={() =>{
                setOpenEdit(true),
                setEditData(row.original)}}
              className="p-2 bg-green-500 rounded-full hover:text-green-900 text-white transition"
            >
              <GoPencil size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true),
                setDeleteSubCategory(row.original)
              }}
              className="p-2 bg-red-500 rounded-full hover:text-red-900 text-white transition">
              <RiDeleteBin6Line size={20} />
            </button>
          </div>
        );
      },
    }),
  ];


  const handleDeleteSubCategory = async () => {
    try {
      const response = await api({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData?.success) {
        toast.success(responseData?.message);
        fetchSubcategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: " " })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <section className="min-h-screen">
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-2xl"
        >
          Add Sub Category
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[85vw] ">
        <DisplayTable data={data} column={column} />
      </div>

      {openAddSubCategory && (
        <UploadSubCategory
          close={() => {
            setOpenAddSubCategory(false);
          }}
          fetchData={fetchSubcategory}
        />
      )}

      {ImageUrl && <ViewImage1 url={ImageUrl} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubcategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmDeleteBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
}

export default SubCategoryPage
