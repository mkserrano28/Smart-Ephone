import React from "react";

function Hero({ darkMode }) {
  return (
    <div
      className={`relative w-full py-16 px-4 overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "hero-gradient-animate text-black"
      }`}
    >
      {/* Main Content */}
      <div className="relative z-20 flex mt-30 flex-col items-center text-center max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Save big on <span className="text-yellow-500">on every Season</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-xl">
          Discover the best discounts on tech. Grab limited-time offers now!
        </p>
        <button
          className={`mt-6 py-3 px-6 font-semibold rounded shadow-md transition-all ${
            darkMode
              ? "bg-yellow-300 text-black hover:bg-yellow-400"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          Shop Now
        </button>
      </div>

      {/* Product Tiles */}
      <div className="relative z-20 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 text-left">
          <h3 className="font-bold mb-2">Pick up where you left off</h3>
          <img src="/images/hero1.jpeg" alt="Product 1" className="w-full h-32 object-cover rounded" />
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 text-left">
          <h3 className="font-bold mb-2">FREE Shipping to Philippines</h3>
          <img src="/images/card1.jpg" alt="Product 2" className="w-full h-32 object-cover rounded" />
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 text-left">
          <h3 className="font-bold mb-2">Free Shipping Zone</h3>
          <img src="/images/card2.jpg" alt="Product 3" className="w-full h-32 object-cover rounded" />
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 text-left">
          <h3 className="font-bold mb-2">Shop for Home Essentials</h3>
          <img src="/images/card4.jpg" alt="Product 4" className="w-full h-32 object-cover rounded" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
