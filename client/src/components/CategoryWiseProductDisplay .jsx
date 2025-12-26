// Golden Rules (Remember Forever)
// State updates are async
// Never trust state immediately after setState
// Always call APIs inside useEffect
// Keep state type consistent (array → array)

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from 'react-router-dom';
import AxiosToastError from "../utils/AxiosToastError.js"
import api from "../utils/Axios.js"
import SummaryApi from '../common/summaryApi.js';
import CardLoading from "./Product/CardLoading.jsx";
import CardProduct from "./Product/CardProduct.jsx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const CategoryWiseProductDisplay = ({ _id, name }) => {
    const [ data, setData ] = useState([]);
    const [loading, setLoading] = useState(false);

     const scrollRef = useRef(null);
    
      
    const fetchCategoryWiseProduct = useCallback(async () => {
        if (!_id) return;

        try {
            setLoading(true);

            const response = await api({
                ...SummaryApi.getProductByCategory,
                data: {
                    categoryId: _id,
                    limit: 15,
                },
            });

            const { data: responseData } = response;
            
            if (responseData?.success) {
                setData(responseData.data.products);
            }
            
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false);
        }
    }, [_id]);

    useEffect(() => {
      fetchCategoryWiseProduct();
    }, [fetchCategoryWiseProduct]);

    // useEffect(() => {
    //   console.log("Updated products:", data);
    // }, [data]);

    const loadingCardNumber = new Array(6).fill(null);

    const scrollByAmount = () => scrollRef.current?.clientWidth * 0.8 || 300;
  
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
          left: -scrollByAmount(),
          behavior: "smooth",
        });
    }

    const scrollRight = () => {
      scrollRef.current?.scrollBy({
        left: scrollByAmount(),
        behavior: "smooth",
      });
    };

    const arrowBtnClass = "hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white border shadow-lg hover:bg-primary-100 hover:text-white border-blue-100 transition z-10";

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link to="" className="text-green-600 hover:text-green-400">
          See All
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className={`${arrowBtnClass} absolute left-2 top-1/2 -translate-y-1/2 z-10 `}
          aria-label="Scroll left"
        >
          <FaAngleLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 lg:gap-8 mx-auto px-4 sm:px-17 md:px-20 lg:px-5 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory scroll-smooth"
        >
          {
            loading
            ? (loadingCardNumber.map((_, index) => {
                return (
                  <CardLoading
                    key={index + "CategoryWiseProductDisplay123"}
                    className="shrink-0 snap-start"
                  />
                );
              })
            ) : (data.map((p, index) => {
                 return (
                   <CardProduct
                     className="shrink-0 snap-start "
                     data={p}
                     key={p._id + "CategoryWiseProductDisplay" + index}
                   />
                 );
              }))}
        </div>

        <button
          onClick={scrollRight}
          className={`${arrowBtnClass} absolute right-2 top-1/2 -translate-y-1/2 z-10 `}
          aria-label="Scroll right"
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}

export default CategoryWiseProductDisplay 
