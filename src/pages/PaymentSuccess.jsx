import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Redirect user to /orders immediately after loading this page
        navigate("/orders");
    }, [navigate]);

    return (
        <div className="text-center">
            <h2>✅ Payment Successful!</h2>
            <p>Redirecting to your orders...</p>
        </div>
    );
};

export default PaymentSuccess;
