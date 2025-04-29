import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm font-poppins w-full">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and About */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img src="/images/ephone-logo.webp" alt="Smart-Ephone Logo" className="h-10 w-auto rounded-4xl" />
              <span className="text-white text-xl font-semibold ml-2">Smart-Ephone</span>
            </div>
            <p className="max-w-xs">
              Smart-Ephone is a modern tech e-commerce built with React.js, Tailwind CSS, Node.js, MongoDB, AWS S3, and Vercel. Bringing smart technology closer to you.
            </p>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="hover:underline">Smartphones</a></li>
              <li><a href="/products" className="hover:underline">Accessories</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
            </ul>
          </div>

          {/* Technologies Used */}
          <div>
            <h3 className="text-white font-semibold mb-4">Technologies</h3>
            <ul className="space-y-2">
              <li><a href="https://reactjs.org/" className="hover:underline" target="_blank" rel="noopener noreferrer">React.js</a></li>
              <li><a href="https://tailwindcss.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Tailwind CSS</a></li>
              <li><a href="https://aws.amazon.com/s3/" className="hover:underline" target="_blank" rel="noopener noreferrer">AWS S3/CloudFront/ACM/ElasticBeanstalk/VPC/EC2</a></li>
              <li><a href="https://aws.amazon.com/s3/" className="hover:underline" target="_blank" rel="noopener noreferrer">Route53/Load balancer/IAM</a></li>
              <li><a href="https://vercel.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Node.JS/PostMan-API/MongoDB Atlas</a></li>
            </ul>
          </div>

          {/* Follow Me Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Me</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/mkserrano28" className="hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/mark-serrano-520299250" className="hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <span>© 2025 Smart-Ephone. All rights reserved.</span>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
