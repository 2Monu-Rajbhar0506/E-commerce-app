import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { TypeAnimation } from "react-type-animation";
import { useLocation, useNavigate,Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobile = useMobile();
  const params = useLocation();
  const searchText = params?.search?.slice(3);


  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e?.target?.value
    const url = `/search?q=${value}`
    navigate(url)
  }

  return (
    <div className="w-full max-w-xl min-w-[300px]">
      <div className="flex items-center group focus-within:border-amber-500 bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden focus-within:border-primary-200 transition-all px-4 h-11">
        {/* Show animated placeholder only when NOT on search page */}

        {/* Search Button */}
        <div>
          {isMobile && isSearchPage ? (
            <Link
              to={"/"}
              aria-label="Back"
              className="text-gray-600 hover:text-primary-200 active:scale-90 transition-all group-focus-within:text-amber-500 bg-white rounded-full shadow-md p-2 m-1"
            >
              <FaArrowLeft size={28} />
            </Link>
          ) : (
            <button
              onClick={redirectToSearchPage}
              className="text-gray-600  hover:text-primary-200 active:scale-90 transition-all group-focus-within:text-amber-500"
              aria-label="Search"
            >
              <IoSearch size={24} />
            </button>
          )}
        </div>

        {!isSearchPage ? (
          <span
            onClick={redirectToSearchPage}
            className="text-gray-400 text-sm md:text-base  whitespace-nowrap overflow-hidden select-none grow font-primary cursor-pointer hover:text-primary-200 transition"
          >
            <TypeAnimation
              sequence={[
                "Search for mobiles...",
                1500,
                "Search for laptops...",
                1500,
                "Search for smartwatches...",
                1500,
                "Search for gaming monitors...",
                1500,
                "Search for DSLR cameras...",
                1500,
                "Search for wireless earbuds...",
                1500,
                "Search for power banks & chargers...",
                1500,
                "Search for home appliances...",
                1500,
                "Search for men's & women's clothing...",
                1500,
                "Search for grocery & daily essentials...",
                1500,
              ]}
              speed={60}
              repeat={Infinity}
              cursor={false}
            />
          </span>
        ) : (
          <div className="w-full h-full ">
            <input
              autoFocus
              type="text"
              placeholder="Search your item here..."
              className="grow px-3 py-2 text-sm md:text-base outline-none font-primary  w-full h-full"
              onChange={handleOnChange}
              defaultValue={searchText}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search1;
