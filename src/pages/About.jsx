import React from "react";

function About({ darkMode }) {
    return (
           <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1500">
        <div
            className={`
            min-h-screen px-6 py-16 pt-[100px]
            transition-colors duration-300
            ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
            `}
        >
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-4xl font-extrabold text-center mb-10">
                    About Smart-Ephone
                </h1>
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        Smart-Ephone is a modern e-commerce platform designed for smartphone
                        enthusiasts. Whether you're looking for the latest flagship or a
                        reliable budget phone, we bring you a seamless and intuitive shopping
                        experience — fast, secure, and mobile-friendly.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Features</h2>
                    <ul className="list-disc list-inside space-y-2 text-lg">
                        <li>Smartphone listings with real-time pricing and specs</li>
                        <li>Live category filtering and infinite scroll</li>
                        <li>Detailed cart and checkout system</li>
                        <li>Order tracking with status updates</li>
                        <li>Dark mode for a better visual experience</li>
                        <li>Mobile-first design and responsiveness</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Tech Stack</h2>
                    <p className="text-lg">
                        Smart-Ephone is built using modern technologies:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-lg">
                        <li>Frontend: React, Vite, Tailwind CSS</li>
                        <li>Backend: Node.js, Express, MongoDB</li>
                        <li>Deployment: AWS (S3, CloudFront, Elastic Beanstalk)</li>
                        <li>CI/CD: GitHub Actions</li>
                        <li>Payment: PayMongo</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Let's Connect</h2>
                    <p className="text-lg">
                        Want to learn more, collaborate, or just say hi? Visit our GitHub
                        or LinkedIn profiles linked in the footer. We’d love to hear from you!
                    </p>
                </section>
            </div>
        </div>
        </div>
    );
}

export default About;
