import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

function CartDetails({ darkMode, addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  const formatPeso = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount ?? 0);

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

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      const productImage = document.querySelector(".product-image");
      const cartIcon = document.querySelector("#cart-icon");

      if (productImage && cartIcon) {
        const imageRect = productImage.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        const imgClone = productImage.cloneNode(true);

        imgClone.style.position = "fixed";
        imgClone.style.left = `${imageRect.left}px`;
        imgClone.style.top = `${imageRect.top}px`;
        imgClone.style.width = `${imageRect.width}px`;
        imgClone.style.height = `${imageRect.height}px`;
        imgClone.style.transition = "all 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
        imgClone.style.zIndex = "9999";
        imgClone.style.borderRadius = "12px";
        imgClone.style.opacity = "1";

        document.body.appendChild(imgClone);

        requestAnimationFrame(() => {
          imgClone.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
          imgClone.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
          imgClone.style.width = `40px`;
          imgClone.style.height = `40px`;
          imgClone.style.opacity = "0.5";
        });

        setTimeout(() => {
          imgClone.remove();
        }, 1600);
      }
    }, 400); // Give scroll time


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
      className={`
    min-h-screen p-4 md:p-8 lg:p-10 pt-24
    transition-colors duration-300
    ${darkMode ? "bg-gray-900 text-white" :
          "bg-gray-100 text-black"}
  `}
    >

      <div
        className="
          flex flex-col sm:mt-26 lg:flex-row
          items-center justify-center
          text-center lg:text-left
          max-w-6xl mx-auto gap-10
          min-h-[calc(100vh-200px)]
        "
      >
        {/* Left: Image Carousel */}
        <div
          className="
            w-full lg:w-1/2
            bg-white dark:bg-gray-800
            rounded-xl p-4 shadow
            flex justify-center
          "
        >
          <div className="w-full max-w-[450px]">
            <Slider {...sliderSettings}>
              {images.map((img, i) => (
                <div key={i} className="px-4">
                  <img
                    src={img}
                    alt={`Product view ${i + 1}`}
                    className="
                      product-image w-full
                      h-[300px] sm:h-[400px] md:h-[500px]
                      object-contain rounded-xl
                    "
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Right: Product Info */}
        <div
          className="
            w-full lg:w-1/2
            max-w-[500px]
            space-y-4
            flex flex-col items-center lg:items-start
          "
        >
          <div>
            <p className="text-sm font-semibold text-orange-500">New</p>
            <h2 className="text-2xl sm:text-3xl font-bolds">{product.model}</h2>
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
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${selectedColor === color
                      ? "ring-2 ring-offset-2 ring-yellow-500"
                      : "border-gray-300"
                    }
                  `}
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
                  className={`
                    px-4 py-2 border rounded-md font-medium
                    ${selectedStorage === option
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }
                  `}
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
            {formatPeso(product.price)}
          </p>

          <button
            onClick={handleAddToCart}
            className={`
              mt-6 py-3 px-6
              font-semibold rounded shadow-md
              transition-all
              ${darkMode
                ? "bg-yellow-300 text-black hover:bg-yellow-400"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
              }
            `}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDetails;
