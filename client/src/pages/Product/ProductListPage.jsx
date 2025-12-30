import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";
import SummaryApi from "../../common/summaryApi";

import Loader from "../../components/Loader.jsx";
import CardProduct from "../../components/Product/CardProduct.jsx";
import { validURLConvert } from "../../utils/ValidUrlConverter.js";

const ProductListPage = () => {
  const { category, subCategory } = useParams();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [displaySubCategories, setDisplaySubCategories] = useState([]);

  const allSubCategoryData = useSelector(
    (state) => state.product.allSubCategory
  );

  const categoryId = category?.split("-").at(-1);
  const subCategoryId = subCategory?.split("-").at(-1);

  const subCategoryName = subCategory
    ?.split("-")
    .slice(0, -1)
    .join(" ");
  
  const categoryName = category
    ?.split("-")
    .slice(0, -1)
    .join(" ");

  // fetch the products
  const fetchProductData = useCallback(async () => {
    if (!categoryId || !subCategoryId) return;

    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 10,
        },
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setProducts((prev) =>
          page === 1
            ? responseData.data.products
            : [...prev, ...responseData.data.products]
        );

        setTotalPages(responseData.data.pagination.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, subCategoryId, page]);

  // reset pagination on route change
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [categoryId, subCategoryId]);

  // Fetch products
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

//filter the subCategories
  useEffect(() => {
    if (!categoryId || !allSubCategoryData?.length) return;

    //“From all subcategories, keep only those subcategories that belong to the selected category.
    const filtered = allSubCategoryData.filter((sub) =>
      sub.categories?.some((cat) => cat._id === categoryId)
    );

    setDisplaySubCategories(filtered);
  }, [categoryId, allSubCategoryData]);


const handleLoadMore = () => {
  if (page < totalPages && !loading) {
    setPage((prev) => prev + 1);
  }
};


  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[100px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sub Categories */}
        <aside className="bg-white">
          <div className="shadow-md lg:p-4 md:p-4 p-1 font-semibold">
            Sub category
          </div>

          <div className="min-h-[80vh] max-h-[80vh] overflow-y-scroll scrollbarCustom">
            {displaySubCategories.map((sub) => (
              <Link
                to={`/${validURLConvert(
                  categoryName
                )}-${categoryId}/${validURLConvert(sub.name)}-${sub._id}`}
                key={sub._id}
                className={`relative flex flex-col items-center gap-2 p-3 border border-b-gray-300
                          border-blue-100 cursor-pointer hover:bg-amber-200 transition mt-4
                          ${subCategoryId === sub._id ? "bg-amber-300" : ""}`}
              >
                <div className="w-16 h-16 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-xs font-medium text-gray-700 text-center">
                  {sub.name}
                </p>
              </Link>
            ))}
          </div>
        </aside>

        {/* Products */}
        <main>
            <div className="bg-white shadow-md p-4 z-10">
              <h3 className="font-semibold">{subCategoryName}</h3>
            </div>

          <div className="min-h-[80vh] max-h-[80vh] overflow-y-scroll scrollbarCustom">
            <div className="grid grid-cols-1 p-4 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <CardProduct key={product._id} data={product} />
              ))}
            </div>
          </div>

          {loading && <Loader />}

          {page < totalPages && (
            <div className="flex justify-center my-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default ProductListPage;
