import React from "react";

function InfiniteCarousel({ darkMode }) {
  const images = [
    "/logo/AWS.jpg",
    "/logo/chatgpt.jpeg",
    "/logo/JS.jpg",
    "/logo/node.jpg",
    "/logo/paymongo.png",
    "/logo/postman.jpg",
    "/logo/React.png",
    "/logo/tailwind.png",
    "/logo/api.jpg",
  ];

  // Tripled for seamless infinite loop
  const loopImages = [...images, ...images, ...images];

  return (
    <div className={`py-10 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-center text-4xl font-bold mb-6">
        Powered <span className="text-yellow-500">By</span>
      </h2>

      {/* Carousel wrapper without fading edges */}
      <div className="relative overflow-hidden hover-pause">
        {/* Removed fade overlay */}

        {/* Scrolling track */}
        <div className="flex animate-infinite-scroll w-max">
          {loopImages.map((src, index) => (
            <div
              key={index}
              className="w-48 h-32 mx-3 flex-shrink-0 rounded-xl bg-white shadow-md overflow-hidden"
            >
              <img
                src={src}
                alt={`carousel-img-${index}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/images/placeholder.jpg")}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfiniteCarousel;
