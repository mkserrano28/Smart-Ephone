import React from "react";
import { Link } from "react-router-dom"; // ✅ Import added

function Hero({ darkMode }) {
  return (
    <div
      className={`
        relative w-full px-4 py-10 sm:py-12 overflow-hidden
        ${darkMode
          ? "bg-gray-900 text-white"
          : "hero-gradient-animate text-black"
        }
      `}
    >
      {/* Main Content */}
      <div
        className="
          relative z-20 flex flex-col items-center 
          text-center max-w-5xl mx-auto mt-30
        "
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Save big on <span className="text-yellow-500">on every Season</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-xl">
          Discover the best discounts on tech. Grab limited-time offers now!
        </p>
        <Link to="/products">
          <button
            className={`
              mt-6 py-3 px-6 font-semibold rounded shadow-md transition-all
              ${darkMode
                ? "bg-yellow-300 text-black hover:bg-yellow-400"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
              }
            `}
          >
            Shop Now
          </button>
        </Link>
      </div>

      {/* Product Tiles */}
      <div
        className="
          relative z-20 mt-10 grid grid-cols-1 
          sm:grid-cols-2 lg:grid-cols-4 gap-6 
          max-w-7xl mx-auto
        "
      >
        {[
          { title: "Pick up where you left off", img: "/images/hero1.jpeg" },
          { title: "FREE Shipping", img: "/images/card1.jpg" },
          { title: "Shop anywhere", img: "/images/card2.jpg" },
          { title: "We Deliver worldwide", img: "/images/card4.jpg" },
        ].map((tile, index) => (
          <div
            key={index}
            className="
              bg-white dark:bg-gray-800 dark:text-white 
              shadow-md rounded-lg p-4 text-left
            "
          >
            <h3 className="font-bold mb-2">{tile.title}</h3>
            <img
              src={tile.img}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
