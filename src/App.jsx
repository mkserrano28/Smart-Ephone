import { useState } from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Carousel from "./pages/Carousel";
import Cart from "./pages/Cart";
import Footer from "./pages/Footer"

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [darkMode, setDarkMode] = useState(false); // ✅ Single dark mode state

    const addToCart = (phone) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === phone.id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === phone.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...phone, quantity: 1 }];
            }
        });
    };

    const updateCartQuantity = (id, action) => {
        setCartItems((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: action === "increase" ? item.quantity + 1 : item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    return (
        <div className={darkMode ? "dark bg-black text-white" : "bg-white text-black"}>
            <Navbar 
                cartItems={cartItems} 
                updateCartQuantity={updateCartQuantity} 
                removeFromCart={removeFromCart} 
                darkMode={darkMode}  // ✅ Pass darkMode to Navbar
                setDarkMode={setDarkMode}  // ✅ Pass setDarkMode to Navbar
            />
            
            <Hero darkMode={darkMode} />  {/* ✅ Pass darkMode to Hero */}
            <Carousel darkMode={darkMode} />
            <Cart addToCart={addToCart} darkMode={darkMode} />
            <Footer />

        </div>
    );
}

export default App;
