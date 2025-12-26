import React, { useCallback } from 'react';
import banner from "../assets/banner.jpg"
import bannerMobile from "../assets/banner-mobile.jpg"
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/ValidUrlConverter'
import { useNavigate, Link } from 'react-router-dom'
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay ";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.category.loading);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = useCallback(
    (categoryId, categoryName) => {
      if (!categoryId || !Array.isArray(subCategoryData)) return;

      const matchedSubCategories = subCategoryData.filter(
        (sub) =>
          Array.isArray(sub.categories) &&
          sub.categories.some((c) => c._id === categoryId)
      );

      // console.log({
      //   categoryId,
      //   categoryName,
      //   matchedSubCategories,
      // });

      if (!matchedSubCategories.length) return;
       const firstSub = matchedSubCategories[0];
    
      const url = `/${validURLConvert(categoryName)}-${categoryId}/${validURLConvert(firstSub.name)}-${firstSub._id}`;
      navigate(url);
      //console.log(url);

    },
    [subCategoryData, navigate]
  );

  return (
    <section className="bg-white/40">
      {/**for banners  */}
      <div className="container mx-auto ">
        <div
          className={`w-full h-full min-h-48 rounded ${
            !bannerMobile || !banner ? "animate-pulse bg-blue-100 my-2" : ""
          }`}
        >
          {banner ? (
            <img
              src={banner}
              alt="banner"
              className="w-full h-full hidden lg:block"
            />
          ) : (
            ""
          )}

          {bannerMobile ? (
            <img
              src={bannerMobile}
              alt="bannerMobile"
              className="w-full h-full  lg:hidden"
            />
          ) : (
            ""
          )}
        </div>
      </div>

      {/**for displaying categories */}
      <div className="container mx-auto px-4 my-4 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {loadingCategory
          ? Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`loading-category-${index}`}
                className="bg-white rounded-xl p-3 min-h-[140px] grid gap-3 shadow-sm animate-pulse"
              >
                <div className="bg-blue-100 h-24 rounded-lg"></div>
                <div className="bg-blue-100 h-6 rounded-md"></div>
              </div>
            ))
          : categoryData?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className="
                          group bg-white rounded-xl p-3 shadow-sm
                          hover:shadow-md hover:-translate-y-1
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary-200
                          "
                aria-label={`Open ${cat.name} category`}
              >
                <div className="w-full h-40 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="
                              max-h-full object-contain
                              group-hover:scale-105 transition-transform duration-200
                              "
                  />
                </div>

                <p className="mt-2 text-sm font-medium text-gray-700 text-center truncate">
                  {cat.name}
                </p>
              </button>
            ))}
      </div>

      {/**display category wise products */}
      {
        categoryData?.map((c, index) => {
          return (
            <CategoryWiseProductDisplay
              key={c?._id + "CategoryWiseProduct" + index}
              _id={c?._id}
              name={c?.name}
            />
          )
        })
      }
    </section>
  );
}

export default Home
