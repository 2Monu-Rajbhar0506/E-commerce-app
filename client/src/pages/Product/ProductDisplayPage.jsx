import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import SummaryApi from "../../common/summaryApi";
import api from "../../utils/Axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees.js";
import Divider from "../../components/Divider.jsx";
import image1 from "../../assets/minute_delivery.png";
import image2 from "../../assets/Best_Prices_Offers.png";
import image3 from "../../assets/Wide_Assortment.png";
import { PriceWithDiscount } from "../../utils/PriceWithDiscount.js";

const ProductDisplayPage = () => {
  const { product } = useParams();
  const productId = product?.split("-")?.at(-1);

  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // complete initial shape (VERY IMPORTANT)
  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    unit: "",
    description: "",
    more_details: {},
  });

  const imageContainer = useRef(null);

  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const response = await api({
        ...SummaryApi.getProductDetails(productId),
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setData(responseData.data);
        setImageIndex(0); // reset image index on product change
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 120;
    }
  };

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 120;
    }
  };

  return (
    <div>
      <section className="container mx-auto p-4 grid lg:grid-cols-2 gap-6">
        {/* ---------------- LEFT IMAGE SECTION ---------------- */}
        <div>
          <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 w-full h-full flex items-center justify-center">
            <img
              src={data?.image?.[imageIndex]}
              alt={data?.name || "product image"}
              className="w-full h-full object-scale-down"
            />
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-4 my-2">
            {data?.image?.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                  index === imageIndex ? "bg-primary-100" : "bg-amber-100"
                }`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="relative">
            <div
              ref={imageContainer}
              className="flex items-center gap-4 w-full overflow-x-auto scrollbar-hide py-2"
            >
              {data?.image?.map((img, index) => (
                <div
                  key={img + index}
                  className={`w-20 h-20 min-w-20 shadow-md cursor-pointer border rounded ${
                    index === imageIndex
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setImageIndex(index)}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-scale-down"
                  />
                </div>
              ))}
            </div>

            {/* Scroll buttons (desktop only) */}
            <div className="absolute inset-y-0 left-0 right-0 hidden lg:flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={handleScrollLeft}
                aria-label="Scroll images left"
                className="pointer-events-auto bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
              >
                <FaAngleLeft />
              </button>

              <button
                type="button"
                onClick={handleScrollRight}
                aria-label="Scroll images right"
                className="pointer-events-auto bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT PRODUCT DETAILS ---------------- */}
        <div
          className="
                bg-white
                rounded
                shadow-md
                p-6 lg:p-7
                text-base lg:text-lg
                max-h-[80vh]
                overflow-y-auto
                scrollbarCustom
              "
        >
          <p className="bg-green-300 w-fit px-2 rounded-full">10 min</p>

          <h2 className="text-lg font-semibold lg:text-3xl mt-2">
            {data.name}
          </h2>

          <p className="text-gray-600">{data.unit}</p>

          <Divider />

          <div>
            <p className="font-medium">Price</p>
            <div  className="flex items-center gap-2 lg:gap-4">
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold">
                  {DisplayPriceInRupees(PriceWithDiscount(data?.price, data?.discount))}
                </p>
              </div>
              {
                data.discount && (
                  <p className="line-through text-lg text-gray-700">{ DisplayPriceInRupees(data?.price) }</p>
                )
              }
             {
                data.discount && (
                   <p className="font-bold text-green-600 lg:text-2xl">{ data.discount }% <span className="text-base text-neutral-500 ">Discount</span></p>
              )
             }
            </div>
          </div>

          {/*<div className="flex items-center gap-4 mt-4">
            {data.discount && (
              <p className="text-sm text-red-500">{data.discount}% OFF</p>
            )}
          </div>*/}

          <p
            className={`mt-2 text-sm ${
              data.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {data?.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/*data?.stock > 0 ? (
            <button
              className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
              disabled={data?.stock <= 0}
            >
              Add to Cart
            </button>
          ) : (
            " "
          )*/}

          <button
            className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            disabled={data?.stock <= 0}
          >
            Add to Cart
          </button>

          <h2 className="font-semibold mt-6">Why shop from binkeyit?</h2>

          {[image1, image2, image3].map((img, idx) => (
            <div key={idx + 1} className="flex items-center gap-4 my-4">
              <img src={img} alt="benefit" className="w-20 h-20" />
              <div className="text-sm">
                <div className="font-semibold">
                  {idx === 0
                    ? "Superfast Delivery"
                    : idx === 1
                    ? "Best Prices & Offers"
                    : "Wide Assortment"}
                </div>
                <p>
                  {idx === 0 &&
                    "Get your order delivered at the earliest from nearby stores."}
                  {idx === 1 &&
                    "Best prices with offers directly from manufacturers."}
                  {idx === 2 &&
                    "Choose from 5000+ products across multiple categories."}
                </p>
              </div>
            </div>
          ))}

          {/* Details */}
          <div className="my-4 grid gap-3">
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-base">{data.description}</p>
            </div>

            <div>
              <p className="font-semibold">Unit</p>
              <p className="text-base">{data.unit}</p>
            </div>

            {data?.more_details &&
              Object.entries(data.more_details).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold">{key}</p>
                  <p className="text-base">{value}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDisplayPage;

/*
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import SummaryApi from "../../common/summaryApi";
import api from "../../utils/Axios";

const ProductDisplayPage = () => {
  const { product } = useParams();
  const productId = product?.split("-").at(-1);

  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    discount: null,
    unit: "",
    stock: 0,
    description: "",
    more_details: {},
  });

  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await api({
        ...SummaryApi.getProductDetails(productId),
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
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <p className="p-4">Loading product...</p>;
  }

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-3 gap-6">
      {/* IMAGE SECTION }
      <div className="lg:col-span-1">
        <div className="bg-white rounded shadow-md h-[350px] flex items-center justify-center">
          <img
            src={data?.image?.[imageIndex]}
            alt={data?.name}
            className="h-full object-contain"
          />
        </div>

        {/* Image thumbnails }
        <div className="flex gap-3 justify-center mt-4">
          {data?.image?.map((img, index) => (
            <img
              key={img}
              src={img}
              onClick={() => setImageIndex(index)}
              className={`w-16 h-16 object-contain cursor-pointer border rounded
                ${index === imageIndex ? "border-green-500" : "border-gray-300"}
              `}
              alt="thumbnail"
            />
          ))}
        </div>
      </div>

      {/* PRODUCT INFO }
      <div className="lg:col-span-2 bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <p className="text-gray-500 mt-1">{data.unit}</p>

        {/* Price }
        <div className="flex items-center gap-4 mt-4">
          <p className="text-2xl font-bold text-green-600">₹{data.price}</p>

          {data.discount && (
            <p className="text-sm text-red-500">{data.discount}% OFF</p>
          )}
        </div>

        {/* Stock }
        <p
          className={`mt-2 text-sm ${
            data.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {data.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {/* Add to cart }
        <button
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={data.stock <= 0}
        >
          Add to Cart
        </button>

        {/* Description }
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Description</h3>
          <p className="text-gray-700 mt-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* MORE DETAILS }
        <div className="mt-6 space-y-4">
          {Object.entries(data.more_details || {}).map(([key, value]) => (
            <div key={key}>
              <h4 className="font-semibold">{key}</h4>
              <p className="text-sm text-gray-600">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;*/
