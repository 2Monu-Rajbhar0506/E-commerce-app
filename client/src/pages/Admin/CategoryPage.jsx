import React,{useEffect, useState} from 'react'
import UploadCategoryModel from '../../components/Admin/UploadCategoryModel';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import api from '../../utils/Axios';
import SummaryApi from '../../common/summaryApi';
import AxiosToastError from '../../utils/AxiosToastError';
import EditCategory from '../../components/Admin/EditCategory';
import ConfirmDeleteBox from '../../components/Admin/ConfirmDeleteBox';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });

  const [openConfirmDeleteBox, setOpenConfirmDeleteBox] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });

 /* const allCategory = useSelector(state => state.product.allCategory);
  console.log("all category from redux", allCategory);
 
  useEffect(() => {
    setLoading(true)
    setCategoryData(allCategory)
    setLoading(false)
  }, [allCategory]);*/

   const fetchCategory = async () => {
     try {
       setLoading(true);
   
       const response = await api({
         ...SummaryApi.getCategory,
       });

       if (response.data?.success) {
         const { data: CategoryData } = response;
         setCategoryData(CategoryData?.data);
         console.log(CategoryData?.data);
         /**or --> const { data: CategoryData } = response.data;
                   setCategoryData(CategoryData);
          */
       }

     } catch (error) {
       AxiosToastError(error);
     } finally {
       setLoading(false);
     }
   }

   useEffect(() => {
     fetchCategory();
   }, []);


  const handleDeleteCategory = async() => {
    try {
      const response = await api({
        ...SummaryApi.deleteCategory,
        data: deleteCategory
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData?.message);
        fetchCategory();
        setOpenConfirmDeleteBox(false);
      }

    } catch (error) {
      AxiosToastError(error);
    }
  }


  return (
    <section className="min-h-screen">
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-2xl"
        >
          Add Category
        </button>
      </div>

      {/**No Data */}
      {(!categoryData[0] || !categoryData.length) && !loading && <NoData />}

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 ">
        {categoryData.map((category, index) => {
          return (
            <div
              key={category._id}
              className="w-32 h-56 bg-blue-100 group rounded shadow-md mt-5 flex flex-col items-center p-2"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-contain"
              />
              <p className="mt-2 text-center text-sm font-medium text-neutral-900">
                {category.name}
              </p>

              <div className="flex group-hover:flex items-center w-full mt-auto lg:hidden gap-1">
                <button
                  onClick={() => {
                    setOpenEdit(true), setEditData(category);
                  }}
                  className="flex-1 p-2 text-xs bg-green-400 hover:bg-green-600 text-green-100  font-medium rounded-l"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmDeleteBox(true), setDeleteCategory(category);
                  }}
                  className="flex-1 p-2 text-xs bg-red-400 hover:bg-red-500 text-red-100 font-medium rounded-r"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openConfirmDeleteBox && (
        <ConfirmDeleteBox
          close={() => setOpenConfirmDeleteBox(false)}
          cancel={() => setOpenConfirmDeleteBox(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
}

export default CategoryPage
