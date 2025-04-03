import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

function CartDetails({ darkMode, addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  useEffect(() => {
    fetch("/smartphones.json")
      .then((res) => res.json())
      .then((data) => {
        const phone = data.smartphones.find((p) => p.id.toString() === id);
        setProduct(phone);
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const colors = product.colors || [];
  const storages = product.specifications.storage;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedStorage) {
      alert("Please select a color and storage option.");
      return;
    }
  
    const productImage = document.querySelector(".product-image");
    const cartIcon = document.querySelector("#cart-icon");
  
    if (productImage && cartIcon) {
      const imageRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
  
      const imgClone = productImage.cloneNode(true);
  
      imgClone.style.position = "fixed";
      imgClone.style.left = `${imageRect.left + window.scrollX}px`;
      imgClone.style.top = `${imageRect.top + window.scrollY}px`;
      imgClone.style.width = `${imageRect.width}px`;
      imgClone.style.height = `${imageRect.height}px`;
      imgClone.style.transition = "all 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
      imgClone.style.zIndex = "9999";
      imgClone.style.borderRadius = "12px";
      imgClone.style.opacity = "1";
  
      document.body.appendChild(imgClone);
  
      requestAnimationFrame(() => {
        imgClone.style.left = `${cartRect.left + window.scrollX + cartRect.width / 2 - 20}px`;
        imgClone.style.top = `${cartRect.top + window.scrollY + cartRect.height / 2 - 20}px`;
        imgClone.style.width = `40px`;
        imgClone.style.height = `40px`;
        imgClone.style.opacity = "0.5";
      });
  
      setTimeout(() => {
        imgClone.remove();
      }, 1600);
    }
  
    const cartProduct = {
      ...product,
      selectedColor,
      selectedStorage,
    };
  
    addToCart(cartProduct);
  };
  

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 lg:p-10 mt-12 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center max-w-7xl mx-auto gap-10">
        {/* Left: Image Carousel */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex justify-center">
          <div className="w-full max-w-[450px]">
            <Slider {...sliderSettings}>
              {images.map((img, i) => (
                <div key={i} className="px-4">
                  <img
                    src={img}
                    alt={`Product view ${i + 1}`}
                    className="product-image w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain rounded-xl"
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 space-y-6 w-full max-w-[500px]">
          <div>
            <p className="text-sm font-semibold text-orange-500">New</p>
            <h2 className="text-2xl sm:text-3xl font-bold">{product.model}</h2>
            <p className="mt-2 text-base sm:text-lg">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          </div>

          {/* Color Picker */}
          <div>
            <p className="font-semibold text-base sm:text-lg mb-2">Color</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : "border-gray-300"
                    }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Storage Picker */}
          <div>
            <p className="font-semibold text-base sm:text-lg mb-2">Storage</p>
            <div className="flex flex-wrap gap-3">
              {storages.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedStorage(option)}
                  className={`px-4 py-2 border rounded-md font-medium ${selectedStorage === option
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="text-sm space-y-1">
            <p>
              <strong>Display:</strong> {product.specifications.display}
            </p>
            <p>
              <strong>Processor:</strong> {product.specifications.processor}
            </p>
            <p>
              <strong>RAM:</strong> {product.specifications.ram}
            </p>
            <p>
              <strong>Battery:</strong> {product.specifications.battery}
            </p>
          </div>

          <p className="text-xl font-bold">
            ₱{product.price.toFixed(2)} {product.currency}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-slate-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDetails;
