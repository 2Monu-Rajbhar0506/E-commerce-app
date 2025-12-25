/*import React, { useState, useEffect, useCallback } from "react";
import AxiosToastError from "../../utils/AxiosToastError";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import Loader from "../../components/Loader.jsx";
import ProductCardAdmin from "../../components/Admin/ProductCardAdmin.jsx";
import { RiSearchLine } from "react-icons/ri";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.getProduct,
        params: {
          page,
          limit: 12,
          search,
        },
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setProducts(responseData.data.products);
        setTotalPages(responseData.data.pagination.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    };
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    };
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  }

  useEffect(() => {
    let flag = true

    const interval = setTimeout(() => {
      if (flag) {
        fetchProducts();
        flag = false
      }
    }, 300);

    return () => {
      clearTimeout(interval)
    }
    
  },[search])

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="bg-blue-50 ml-auto px-4 py-2 flex items-center gap-3 rounded border focus-within:border-primary-100 border-blue-50">
          <RiSearchLine size={25} />
          <input
            type="text"
            onChange={handleOnChange}
            value={search}
            placeholder="Search Product here ..."
            className="h-full outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="p-4 text-gray-500 text-center">No Products found</p>
      )}

      {!loading && products.length > 0 && (
        <div className="p-4 bg-blue-50 ">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[55vh] ">
            {products.map((product) => (
              <ProductCardAdmin key={product._id} data={product} />
            ))}
          </div>

      
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-4 py-1 border rounded ${
                page === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary-200 hover:text-white border-primary-200"
              }`}
            >
              Previous
            </button>

            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-1 border rounded ${
                page === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary-200 hover:text-white border-primary-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Product;*/


import React, { useState, useEffect, useCallback } from "react";
import AxiosToastError from "../../utils/AxiosToastError";
import api from "../../utils/Axios";
import SummaryApi from "../../common/summaryApi";
import Loader from "../../components/Loader.jsx";
import ProductCardAdmin from "../../components/Admin/ProductCardAdmin.jsx";
import { RiSearchLine } from "react-icons/ri";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  //fetchProducts depends on BOTH page & search
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.getProduct,
        params: {
          page,
          limit: 12,
          search: search.trim(),
        },
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setProducts(responseData.data.products);
        setTotalPages(responseData.data.pagination.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  //Single effect with debounce
  // This runs when page or search changes.
  // Waits 300 milliseconds before calling API.
  // This is called debouncing.
  // It prevents API calls on every keystroke while typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
    // Cancels the previous timer if:
    // User types again quickly
    // Page changes fast
    // Result: Only the final search value triggers the API call
  }, [fetchProducts]);


  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    };
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    };
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1); // reset page when search changes
  };

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>

        <div className="bg-blue-50 ml-auto px-4 py-2 flex items-center gap-3 rounded border focus-within:border-primary-100">
          <RiSearchLine size={22} />
          <input
            type="text"
            value={search}
            onChange={handleOnChange}
            placeholder="Search Product here..."
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try a different search</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[55vh]">
            {products.map((product) => (
              <ProductCardAdmin key={product._id} data={product} />
            ))}
          </div>

          {/**Adding the pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-4 py-1 border rounded text-sm font-medium transition ${
                page === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary-200 hover:text-white border-primary-200 text-primary-200"
              }`}
            >
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-1 border rounded text-sm font-medium transition ${
                page === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary-200 hover:text-white border-primary-200 text-primary-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Product;

