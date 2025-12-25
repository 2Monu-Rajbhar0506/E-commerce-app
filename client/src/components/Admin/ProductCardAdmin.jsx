import React from 'react'

const ProductCardAdmin = ({data, }) => {
  return (
    <div>
         <div className='w-36 p-4 bg-white rounded'>
              <img
                  src={data?.image[0]}
                  alt={data.name}
                  className='h-full w-full object-scale-down'
              />
          </div>
          <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
          <p className='text-slate-400'>{data?.unit}</p>
    </div>
  )
}

export default ProductCardAdmin
