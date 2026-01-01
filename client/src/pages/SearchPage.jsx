import React, { useEffect, useState } from "react";
import CardLoading from "../components/Product/CardLoading.jsx";
import CardProduct from "../components/Product/CardProduct.jsx";
import SummaryApi from "../common/summaryApi";
import api from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import noDataImage from "../assets/nothing here yet.webp";

const SearchPage = ({ search = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useLocation()

  const searchText = params?.search?.slice(3);

  const loadingCardArray = new Array(10).fill(null);
  

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.searchProduct,
        params: {
          search: searchText,
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
  };

  // Reset on new search
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [searchText]);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [searchText, page]);

  // const handleLoadMore = () => {
  //   if (page < totalPages && !loading) {
  //     setPage((prev) => prev + 1);
  //   }
  // };


  const handleFetchMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* header */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Results:
          </h2>
          <p className="text-sm text-gray-600">
            {products.length} product{products.length !== 1 && "s"} found
          </p>
        </div>

        <InfiniteScroll
          dataLength={products.length}
          hasMore={true}
          next={handleFetchMore}
        >
        {/* products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
         
          {
              products.map((product) => (
                <CardProduct key={product._id} data={product} />
              ))
          }
         
          {/* skeletons */}
          {
            loading &&
              loadingCardArray.map((_, index) => (
                <CardLoading key={`loading-${index}`} />
              ))
          }
        </div>
        </InfiniteScroll>
        

        {/* empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="flex justify-center items-center">
              <img
                src={noDataImage}
                alt={"noData"}
                className="w-full h-full max-w-sm max-h-sm"
              />
            </div>
            <p className="text-lg font-medium text-gray-700 my-2">
              No products found
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try searching with a different keyword
            </p>
          </div>
        )}

        {/* load more */}
        {/*page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="
                px-6 py-2
                rounded-full
                bg-green-600
                text-white
                font-medium
                hover:bg-green-700
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )*/}
      </div>
    </section>
  );
};

export default SearchPage;
