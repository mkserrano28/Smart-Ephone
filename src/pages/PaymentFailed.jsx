import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-2xl font-bold text-red-600">❌ Payment Failed!</h1>
            <p className="text-gray-600">Something went wrong. Please try again.</p>
            <button
                onClick={() => navigate("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Return to Home
            </button>
        </div>
    );
}

export default PaymentFailed;
