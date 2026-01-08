/*import React,{useState} from 'react'
import { DisplayPriceInRupees } from '../../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';
import { validURLConvert } from '../../utils/ValidUrlConverter';
import { PriceWithDiscount } from '../../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton.jsx';

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`

  return (
    <Link
      to={url}
      className="border border-gray-200 py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-45 lg:min-w-52 rounded cursor-pointer bg-white hover:bg-primary-100/20"
    >
      <div className="min-h-24 max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt="image"
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="p-1px ml-2 px-2 lg:p-2 rounded-full text-sm lg:text-xs w-fit text-green-600 bg-green-100">
        10 min
      </div>
      <div className="p-1 lg:p-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2 m-2">
        {data.name}
      </div>
      <div className="w-fit ml-2 px-2 lg:px-0 text-sm lg:text-base">
        {data.unit}
      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-4 text-sm lg:text-base">
        <div className="flex items-center gap-1">
          <div className="font-semibold">
            {DisplayPriceInRupees(
              PriceWithDiscount(data?.price, data?.discount)
            )}
          </div>
          {data?.discount > 0 && (
            <p className="text-green-700">{data.discount}%OFF</p>
          )}
        </div>

        <div className="">
          {data.stock === 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
           <AddToCartButton data={data}/>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CardProduct
*/



import React from "react";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validURLConvert } from "../../utils/ValidUrlConverter";
import { PriceWithDiscount } from "../../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton.jsx";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;

  return (
    <div className="border border-gray-200 rounded bg-white hover:bg-primary-100/20 min-w-[180px] lg:min-w-[210px] min-h-[340px] flex flex-col justify-between">
      {/* Clickable area */}
      <Link to={url} className="block">
        {/* Image */}
        <div className="h-32 lg:h-40 flex items-center justify-center bg-gray-50 rounded-t overflow-hidden">
          <img
            src={data?.image?.[0] || "/placeholder.png"}
            alt={data?.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        {/* Delivery time */}
        <div className="px-2 mt-2">
          <span className="inline-block px-2 py-0.5 text-xs text-green-600 bg-green-100 rounded-full">
            10 min
          </span>
        </div>

        {/* Name */}
        <div className="px-2 mt-2 font-medium text-sm lg:text-base line-clamp-2">
          {data.name}
        </div>

        {/* Unit */}
        <div className="px-2 mt-1 text-sm text-gray-600">{data.unit}</div>
      </Link>

      {/* Price + Cart (NOT inside Link) */}
      <div className="px-2 py-3 flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm lg:text-base">
            {DisplayPriceInRupees(
              PriceWithDiscount(data?.price, data?.discount)
            )}
          </div>
          {data?.discount > 0 && (
            <p className="text-xs text-green-700">{data.discount}% OFF</p>
          )}
        </div>

        <div>
          {data.stock === 0 ? (
            <p className="text-xs text-red-500">Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
