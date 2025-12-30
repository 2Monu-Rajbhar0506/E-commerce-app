import React from 'react'
import { DisplayPriceInRupees } from '../../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';
import { validURLConvert } from '../../utils/ValidUrlConverter';

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
      <div className="w-fit ml-2 px-2 lg:px-0 text-sm lg:text-base">{data.unit}</div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-4 text-sm lg:text-base">
        <div className="font-semibold">
          {DisplayPriceInRupees(data.price)}
        </div>
        <div className="bg-green-600 hover:bg-green-700 transition  text-white px-2 lg:px-4 py-1 rounded ">
          <button>Add</button>
        </div>
      </div>
    </Link>
  );
}

export default CardProduct
