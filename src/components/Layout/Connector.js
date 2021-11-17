import React, { Component, useEffect, useState } from "react";
import Settings from "../../modules/Settings";
import { useRef } from "react";
import Header from "../Header";
// import Footer from "../Footer";

// const GET_STARTED_DISALLOWED_ROUTES = [
//     "/account",
// ];

// const shouldGetStaredBeBlocked = path => GET_STARTED_DISALLOWED_ROUTES.some(item => path.startsWith(item));



const Layout = (props) => {


    const outsideSidebarRef = useRef(null);
    const [color, setColor] = useState(localStorage.getItem("themColor") === "zl_page_dark_mode" ? 'zl_page_dark_mode' : 'zl_light_theme_active');

    const themHandler = (val) => {
        setColor(val ? 'zl_light_theme_active' : 'zl_page_dark_mode')
        localStorage.setItem("themColor", val ? !val : 'zl_page_dark_mode');
    }

    const url = window.location.pathname;
    const title = url.split('/')[1]

    function hideSideBar() {
         document.getElementsByClassName("zl_page_sidebar")[0].classList.remove("zl_hide_sidebar");
    }

    return (
        <div className={`zl_all_pages_content ${color}`}>
            <Header title={title} />
            <div className="zl_all_pages_inner_content" onMouseDown={hideSideBar}>
                {props.location.pathname === "/settings" ? <Settings themHandler={themHandler} /> : props.children}
            </div>
            {/* <Footer /> */}
        </div>
    );

}

export default Layout;
