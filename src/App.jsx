import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Carousel from "./pages/Carousel";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/AuthPage";
import Footer from "./pages/Footer";

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

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
                        ? { ...item, quantity: action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                        : item
                )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    return (
        <Router>
            <AppContent 
                cartItems={cartItems} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                addToCart={addToCart} 
                updateCartQuantity={updateCartQuantity} 
                removeFromCart={removeFromCart} 
            />
        </Router>
    );
}

function AppContent({ cartItems, darkMode, setDarkMode, addToCart, updateCartQuantity, removeFromCart }) {
    const location = useLocation();  // Get the current route

    return (
        <div className={darkMode ? "dark bg-black text-white" : "bg-white text-black"}>
            {/* Hide Navbar on /auth page */}
            {location.pathname !== "/auth" && <Navbar cartItems={cartItems} darkMode={darkMode} setDarkMode={setDarkMode} />}

            <Routes>
                <Route path="/" element={
                    <>
                        <Hero darkMode={darkMode} />
                        <Carousel darkMode={darkMode} />
                        <Cart addToCart={addToCart} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} darkMode={darkMode} />
                        <Footer />
                    </>
                } />
                {/* ✅ Pass updateCartQuantity to Checkout */}
                <Route path="/checkout" element={<Checkout cartItems={cartItems} updateCartQuantity={updateCartQuantity} darkMode={darkMode} />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </div>
    );
}

export default App;
