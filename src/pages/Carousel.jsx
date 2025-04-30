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

  const loopImages = [...images, ...images, ...images]; // Tripled for infinite loop

  return (
    <div
      className={`
        py-6 sm:py-8
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
      `}
    >


      {/* Scrolling Carousel Container */}
      <div className="relative overflow-hidden hover-pause">
        <div className="flex animate-infinite-scroll w-max">
          {loopImages.map((src, index) => (
            <div
              key={index}
              className="
                w-48 h-32 mx-3
                flex-shrink-0
                rounded-xl bg-white
                shadow-md overflow-hidden
              "
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
