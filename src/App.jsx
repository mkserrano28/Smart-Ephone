import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Carousel from "./pages/Carousel";
import Cart from "./pages/Cart";
import CartDetails from "./pages/CartDetails";
import Checkout from "./pages/Checkout";
import Authpage from "./pages/Authpage";
import Profile from "./pages/Profile";
import Footer from "./pages/Footer";
import Orders from "./pages/Orders"; // ✅ Import Orders Page
import updateCart from "./pages/updateCart";
import ProtectedRoute from "./pages/ProtectedRoute"; // ✅ Import Protected Route
import Contact from "./pages/Contact"
import About from "./pages/About";
import Layout from "./pages/Layout";
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToTop from "./pages/ScrollToTop";





function AppContent({ cartItems, setCartItems, handleAddToCart, updateCartQuantity, darkMode, setDarkMode }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/auth";
    const [searchTerm, setSearchTerm] = useState("");
    const [showExtras, setShowExtras] = useState(false);

    const handleProductsLoaded = () => {
        setShowExtras(true);
    };

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            setCartItems(savedCart);
        }

        // ✅ Listen for cart updates (triggered when payment is successful)
        const handleCartUpdate = () => setCartItems([]);
        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);


    return (
        <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"} flex flex-col min-h-screen`}>

            {!hideNavbar && (
                <Layout>
                    <Navbar
                        cartItems={cartItems}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </Layout>
            )}
            <Layout>
                {location.pathname === "/" && <Hero darkMode={darkMode} />}
            </Layout>

            <Layout>
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={
                            <Cart
                                handleAddToCart={handleAddToCart}
                                searchTerm={searchTerm}
                                darkMode={darkMode}
                                onProductsLoaded={handleProductsLoaded}
                            />
                        } />
                        <Route path="/products" element={
                            <Cart
                                handleAddToCart={handleAddToCart}
                                darkMode={darkMode}
                                searchTerm={searchTerm}
                                cartItems={cartItems}
                                updateCartQuantity={updateCartQuantity}
                                onProductsLoaded={handleProductsLoaded}
                            />
                        } />
                        <Route path="/auth" element={<Authpage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<About darkMode={darkMode} />} />
                        <Route path="/contact" element={<Contact darkmode={darkMode} />} />
                        <Route path="/cartdetails/:id" element={
                            <CartDetails darkMode={darkMode} addToCart={handleAddToCart} />
                        } />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/checkout" element={
                                <Checkout
                                    cartItems={cartItems}
                                    setCartItems={setCartItems}
                                    updateCartQuantity={updateCartQuantity}
                                    darkMode={darkMode}
                                />
                            } />
                            <Route path="/orders" element={<Orders />} />
                        </Route>
                    </Routes>
                </main>
            </Layout>

            {location.pathname === "/" && showExtras && (
                <Layout>
                    <Carousel darkMode={darkMode} />
                </Layout>
            )}

            {showExtras && (
                <Layout>
                    <Footer />
                </Layout>
            )}




        </div>
    );
}

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            setCartItems(savedCart);
        }
    }, []);

    const saveCart = (updatedCart) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        updateCart(updatedCart);
    };

    const handleAddToCart = (phone) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === phone.id);
            let updatedCart;

            if (existingItem) {
                updatedCart = prevCart.map((item) =>
                    item.id === phone.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [...prevCart, { ...phone, quantity: 1 }];
            }

            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const updateCartQuantity = (itemId, action) => {
        setCartItems((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );

            saveCart(updatedCart);
            return updatedCart;
        });
    };

    return (
        <Router>
            <ScrollToTop />
            <AppContent cartItems={cartItems} setCartItems={setCartItems} handleAddToCart={handleAddToCart} updateCartQuantity={updateCartQuantity} darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
    );
}

export default App;
