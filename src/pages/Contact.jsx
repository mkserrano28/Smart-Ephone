import React, { useState } from "react";



const Contact = () => {
    const [formData, setFormData] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted data:", formData);
        // Here you can POST data to your backend/API
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold mb-4">Contact Me</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
                Feel free to use the form or drop me an email. I’m also open to good old-fashioned phone calls!
            </p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <span className="text-orange-500 text-2xl">📞</span>
                        <span className="text-lg">09615841150</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-orange-500 text-2xl">✉️</span>
                        <span className="text-lg">mkserrano28@gmail.com</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-orange-500 text-2xl">📍</span>
                        <span className="text-lg">Cavinti, Laguna</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            name="first"
                            placeholder="First Name"
                            value={formData.first}
                            onChange={handleChange}
                            className="w-1/2 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                        <input
                            type="text"
                            name="last"
                            placeholder="Last Name"
                            value={formData.last}
                            onChange={handleChange}
                            className="w-1/2 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone (optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <textarea
                        name="message"
                        placeholder="Type your message..."
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
