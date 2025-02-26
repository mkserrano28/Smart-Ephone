import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Carousel from "./pages/Carousel";
import Cart from "./pages/Cart";
import CartDetails from "./pages/CartDetails";
import Checkout from "./pages/Checkout";
import Authpage from "./pages/Authpage";
import Footer from "./pages/Footer";

function AppContent({ cartItems, addToCart, updateCartQuantity, darkMode, setDarkMode }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/auth";

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}>
            {!hideNavbar && <Navbar cartItems={cartItems} darkMode={darkMode} setDarkMode={setDarkMode} />} 
            {location.pathname === "/" && (
                <>
                    <Hero darkMode={darkMode}/>
                    <Carousel darkMode={darkMode}/>
                </>
            )}
            <Routes>
                <Route path="/" element={<Cart addToCart={addToCart} darkMode={darkMode} />} />
                <Route path="/cartdetails/:id" element={<CartDetails addToCart={addToCart} darkMode={darkMode} />} />
                <Route path="/checkout" element={<Checkout cartItems={cartItems} darkMode={darkMode} updateCartQuantity={updateCartQuantity} />} />
                <Route path="/auth" element={<Authpage />} />
            </Routes>
            <Footer />
        </div>
    );
}

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

    const updateCartQuantity = (itemId, action) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    return (
        <Router>
            <AppContent cartItems={cartItems} addToCart={addToCart} updateCartQuantity={updateCartQuantity} darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
    );
}

export default App;
