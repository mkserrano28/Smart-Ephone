const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const updateCart = async (cartItems) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("❌ No User ID Found - Cannot Save Cart!");
        return;
    }

    console.log(`📦 Debug: Sending cart update for user ${userId}:`, cartItems);

    // ✅ Save cart in localStorage
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));

    // ✅ Update cart in MongoDB using `$set`
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, cartItems }),
        });

        const result = await response.json();
        console.log("✅ Cart saved in MongoDB:", result);

        if (!response.ok) {
            throw new Error(result.message || "❌ Failed to sync cart with backend");
        }
    } catch (error) {
        console.error("❌ Failed to sync cart with backend:", error);
    }
};

export default updateCart;
