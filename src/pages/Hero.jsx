import React from "react";

function Hero({ darkMode }) {
    return (
        <div className={`py-10 transition-colors duration-300 mt-10 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="container mx-auto flex flex-col md:flex-row items-center text-center md:text-left px-5 gap-10">

                {/* Text Section (Left) */}
                <div className="flex flex-col w-full md:w-[55%] justify-center items-start p-5">
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-serif ${darkMode ? "text-yellow-300" : "text-blue-800"}`}>
                        Smart-Ephone
                    </h1>
                    <p className="mt-4 text-base sm:text-lg max-w-lg">
                        "Upgrade your lifestyle with our latest smartphone—sleek design,
                        powerful performance, and a camera that captures every moment in stunning detail.
                        Get yours today and experience the future of mobile technology!"
                    </p>
                    <button className={`mt-6 py-3 px-6 sm:px-8 font-semibold border rounded transition-all
                        ${darkMode ? "bg-transparent text-yellow-300 border-yellow-300 hover:bg-yellow-300 hover:text-black" 
                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-800"}`}>
                        Explore Now
                    </button>
                </div>

                {/* Image Section (Right) */}
                <div className="flex justify-center w-full md:w-[45%]">
                    <img 
                        className="w-[90%] sm:w-[350px] md:w-[450px] lg:w-[500px] xl:w-[600px] rounded-lg hover:scale-105 transition-transform duration-300 object-contain" 
                        src="/images/card.jpeg" 
                        alt="Smart-Ephone" 
                    />
                </div>

            </div>
        </div>
    );
}

export default Hero;
