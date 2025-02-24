import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Carousel({ darkMode }) {
    const carouselRef = useRef(null);

    // Ensure images are correctly referenced
    const imageUrls = [
        "/images/card.jpeg",
        "/images/card1.jpg",
        "/images/card2.jpg",
        "/images/card5.png",
    ];

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 400;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className={`py-10 px-4 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-slate-100 text-black"}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">
                    Why E-SmartPhone is important <span className="text-green-600">and number 1?</span>.
                </h2>
            </div>

            {/* Carousel Wrapper */}
            <div className="relative max-w-7xl mx-auto">
                {/* Left Navigation Button */}
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 shadow-md rounded-full p-3 z-10 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft size={28} className="text-gray-700 dark:text-white" />
                </button>

                {/* Scrollable Carousel Container */}
                <div
                    ref={carouselRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 py-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide Scrollbar for all browsers
                >
                    {imageUrls.map((src, index) => (
                        <div
                            key={index}
                            className="snap-center flex-shrink-0 w-[350px] h-[450px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform"
                        >
                            <img 
                                src={src} 
                                alt={`Template ${index}`} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.src = "/images/placeholder.jpg"; }} // Fallback for broken images
                            />
                        </div>
                    ))}
                </div>

                {/* Right Navigation Button */}
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 shadow-md rounded-full p-3 z-10 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight size={28} className="text-gray-700 dark:text-white" />
                </button>
            </div>
        </div>
    );
}

export default Carousel;
