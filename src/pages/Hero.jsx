import React from "react";

function Hero({ darkMode }) {
    return (
        <div className={`py-10 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="container mx-auto flex flex-col md:flex-row items-center text-center md:text-left px-5 gap-10">

                {/* Text Section (Left) */}
                <div className="flex flex-col w-full md:w-1/2 justify-center items-start p-5">
                    <h1 className={`text-4xl md:text-5xl font-serif ${darkMode ? "text-yellow-200" : "text-blue-800"}`}>
                        Smart-Ephone
                    </h1>
                    <p className="mt-4 text-lg max-w-md">
                        "Upgrade your lifestyle with our latest smartphone—sleek design,
                        powerful performance, and a camera that captures every moment in stunning detail.
                        Get yours today and experience the future of mobile technology!"
                    </p>
                    <button className={`mt-6 py-3 px-8 font-semibold border rounded transition-all
                        ${darkMode ? "bg-transparent text-yellow-200 border-yellow-200 hover:bg-yellow-200 hover:text-black" 
                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-800"}`}>
                        Explore Now
                    </button>
                </div>

                {/* Image Section (Right) */}
                <div className="flex justify-center w-full md:w-1/2">
                    <img className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md rounded-lg hover:scale-105 transition-transform duration-300 aspect-[4/3]" 
                         src="/images/hero1.jpeg" alt="Smart-Ephone" />
                </div>

            </div>
        </div>
    );
}

export default Hero;
