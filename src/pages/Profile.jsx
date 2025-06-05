import React from "react";

function Profile({ darkMode }){
    return (
        <>

     <h1 className={`mt-10 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>Username Visible Test</h1>

        </>
    )
}
export default Profile;