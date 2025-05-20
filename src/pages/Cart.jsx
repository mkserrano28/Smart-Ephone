import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Cart({ darkMode, handleAddToCart, searchTerm = "", onProductsLoaded }) {
  const [smartphones, setSmartphones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(false);

  const observer = useRef();



  useEffect(() => {
    let initialCount = 6; // default for desktop
    if (window.innerWidth < 640) {
      initialCount = 2; // mobile
    } else if (window.innerWidth < 1024) {
      initialCount = 3; // tablet
    }

    setVisibleCount(initialCount);

    fetch("/smartphones.json")
      .then((response) => response.json())
      .then((data) => setSmartphones(data.smartphones))
      .catch((error) => console.error("❌ Error loading smartphones:", error));
  }, []);


  const categories = ["All", "Apple", "Samsung", "Google", "Xiaomi", "OnePlus"];

  const filteredSmartphones = smartphones.filter((phone) => {
    const model = phone.model?.toLowerCase() || "";
    const brand = phone.brand?.toLowerCase() || "";

    const matchesCategory =
      selectedCategory === "All" || brand === selectedCategory.toLowerCase();

    const matchesSearch =
      model.includes(searchTerm.toLowerCase()) ||
      brand.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });


  useEffect(() => {
    if (filteredSmartphones.length > 0 && visibleCount >= filteredSmartphones.length) {
      if (onProductsLoaded) {
        onProductsLoaded();
      }
    }
  }, [filteredSmartphones.length, visibleCount, onProductsLoaded]);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let increment = 6; // default desktop

      if (window.innerWidth < 640) {
        increment = 2; // mobile
      } else if (window.innerWidth < 1024) {
        increment = 3; // tablet
      }

      setVisibleCount((prev) => prev + increment);
      setLoading(false);
    }, 800);
  }, []);



  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMore, loading]
  );

  const displayed = filteredSmartphones.slice(0, visibleCount);

  return (
    <div
      className={`
        w-full
        px-4 pt-[60px] sm:pt-[80px] pb-16
        transition-all duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
      `}
    >
      {/* Category Filter */}
      <div className="mb-6">
        <div
          className="
        flex flex-wrap sm:flex-nowrap
        justify-start
        gap-2 sm:gap-3
        overflow-x-auto
        px-1 py-2
        scrollbar-hide
         "
        >

          {categories.map((category, index) => (
            <button
              key={index}
              className={`
              text-sm sm:text-base
              px-3 py-1.5 sm:px-4 sm:py-2
              rounded-full font-medium
              transition whitespace-nowrap
              ${selectedCategory === category
                  ? "bg-yellow-300 text-black"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                }
    `}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleCount(16); // reset scroll on new category
              }}
            >
              {category}
            </button>
          ))}

        </div>
      </div>

      {/* Product Grid */}
      <div className="
  grid
  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6
  gap-4
  items-start
">
        {displayed.map((phone, index) => (
          <div
            key={phone.id}
            ref={index === displayed.length - 1 ? lastItemRef : null}
            className="
    relative
    w-full
    lg:mx-[10px]
    bg-slate-100 dark:bg-slate-800
    rounded-lg overflow-hidden
    transform transition duration-300
    hover:scale-[1.02] hover:shadow-lg
    border border-transparent dark:border-gray-700
    opacity-0 animate-fade-in
  "
          >


            <Link to={`/cartdetails/${phone.id}`}>
              <div
                className="
                  h-40 sm:h-32 w-full
                  flex items-center justify-center
                  overflow-hidden
                "
              >
                <img
                  src={Array.isArray(phone.image) ? phone.image[0] : phone.image}
                  alt={phone.model}
                  className="
                    object-contain w-full h-28
                    transition-opacity duration-700 ease-in-out
                    opacity-0 animate-fade-in
                  "
                  onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                />
              </div>

              <div className="px-2 pb-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {phone.model}
                </h3>
                <p className="text-sm">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(phone.price)}
                </p>
              </div>
            </Link>

            {/* Add to Cart */}
            <Link
              to={`/cartdetails/${phone.id}`}
              className="
              absolute bottom-2 right-2
            bg-yellow-500 hover:bg-yellow-600
            text-white p-1 rounded-full shadow
  "
            >
              <ShoppingCart size={16} />
            </Link>

          </div>
        ))}
      </div>


      {/* Spinner */}
      {loading && visibleCount < filteredSmartphones.length && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="
          bg-gray-200 dark:bg-gray-700
          h-[180px]
          rounded-lg
          animate-pulse
        "
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Cart;
