import React from "react";

const Layout = ({ children }) => {
    return (
        <div
            className="
    max-w-[1600px]  // wider than 7xl (1280px)
    w-full
    mx-auto
    px-6 xl:px-10
  "
        >
            {children}
        </div>
    );
};

export default Layout;
