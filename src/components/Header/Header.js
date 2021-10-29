// svg icons here: http://svgicons.sparkk.fr

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import store from "../../store/index";
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom"

import "./css/Header.css";

const Header = (props) => {

    // hide show header
    const [send, setSend] = useState(false);

    const [notificationFill, setNotificationFill] = useState('#53b9ea');
    const [notificationCount, setNotificationCount] = useState(0);

    const handleToggle = () => {
        setSend(!send);
    };

    const handleToggleMobile = () => {
    	if (window.innerWidth <= 760)
        	setSend(false);
    };
    
    //const [state, setState] = React.useState({ user: {} });
    const [state, setState] = React.useState(store.getState());

    let history = useHistory()
    
    const handleLogOut = (event) => {

        localStorage.removeItem("accessToken");
        history.push('/login');
        toast.success("You have been logged out");

    };

    React.useEffect(() => {

        // listen for state change on images and user info

        var unsubscribe = store.subscribe(() => {
        
            setState(store.getState());
            
			if (state.user.notifications > 0)
			{
			
				var ncount = state.user.notifications;
				
				if (parseInt(state.user.notifications) > 99) ncount = 99;
			
				setNotificationFill('red');
				setNotificationCount(state.user.notifications);
			}
			else
			{
				setNotificationFill('#53b9ea');
				setNotificationCount('0');
			}
            
        });

    }, []) // <-- here put the parameter to listen
    


    return (
        <>
            <section className={`zl_page_sidebar ${send ? "zl_hide_sidebar" : ""}`} title={props.title}>
                <div className="zl_page_sidebar_content">
                    <div className="zl_page_sidebar_logo center-center" >
                        <button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Link to={'/dashboard'}>
                            <img src="/assets/img/qredit-wide.png" alt="logo" className="img-fluid zl_main_logo" />
                            <img src="/assets/img/favicon32.png" alt="logo" className="img-fluid zl_mini_sidebar_logo" />
                            <img src="/assets/img/qredit-wide2.png" alt="light-logo" className="img-fluid zl_light_theme_logo d-none" />
                        </Link>
                    </div>

                    {send == false ? (
                        <div className="row mb-4 no-gutters">
                            <div className="col-auto ml-1">
                                <div style={{ marginLeft: '10px' }} className="avatar avatar-40 rounded-circle position-relative">
                                    <figure className="background" style={{ backgroundImage: (state.userImages && state.userImages.profilepic ? 'url(' + state.userImages.profilepic + ')' : 'url("./assets/img/user1.png")') }}></figure>
                                </div>
                            </div>
                            <div className="col text-center">
                                <p className="text-secondary">{state.user ? state.user.givenname : ''} {state.user ? state.user.familyname : ''}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="row mb-4">
                            <div className="col text-center">
                                <div style={{ marginLeft: '10px' }} className="avatar avatar-40 rounded-circle position-relative">
                                    <figure className="background" style={{ backgroundImage: (state.userImages && state.userImages.profilepic ? 'url(' + state.userImages.profilepic + ')' : 'url("./assets/img/user1.png")') }}></figure>
                                </div>
                            </div>
                        </div>
                    )}


                    <ul className="zl_page_sidebar_nav">
                    
                        <li className="zl_page_sidebar_items" title="notificationsettings">
                            <Link to={'/notificationsettings'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                            	<div style={{textAlign: 'center', marginRight: '15px', width:'20px', height: '20px'}}>
                            		<span style={{fontSize: '16px', color: notificationFill}}>{notificationCount}</span>
                            	</div>
                                <span className="zl_pagesidebar_text">Notifications</span>
                            </Link>
                        </li>
                        
                        <li className="zl_page_sidebar_items" title="dashboard">
                            <Link to={'/dashboard'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/064-home.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Dashboard</span>
                            </Link>
                        </li>

                        <li className="zl_page_sidebar_items" title="contacts">
                            <Link to={'/contacts'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/006-user.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Contacts</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="persona">
                            <Link to={'/persona'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/icons/personalogo.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Persona / KYC</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="wallets">
                            <Link to={'/wallets'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/078-wallet.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Wallets</span>
                                <span className="zl_page_sidebar_notification_dot"></span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="transactions">
                            <Link to={'/transactions'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/088-transfer.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Transactions</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="qslp1">
                            <Link to={'/qslp1'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/081-crown.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Tokens Wallet</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="qreditnft">
                            <Link to={'/qreditnft'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/007-star.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">NFT's</span>
                            </Link>
                        </li>

                        <li className="zl_page_sidebar_items" title="createtokens">
                            <Link to={'/createtokens'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/009-plus.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Create Tokens</span>
                            </Link>
                        </li>
                        {/* <li className="zl_page_sidebar_items" title="referralprogram">
                            <Link to={'/referralprogram'} className="zl_page_sidebar_link position-relative">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="#828CAE" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" fill="828CAE" d="M15.94,10.179l-2.437-0.325l1.62-7.379c0.047-0.235-0.132-0.458-0.372-0.458H5.25c-0.241,0-0.42,0.223-0.373,0.458l1.634,7.376L4.06,10.179c-0.312,0.041-0.446,0.425-0.214,0.649l2.864,2.759l-0.724,3.947c-0.058,0.315,0.277,0.554,0.559,0.401l3.457-1.916l3.456,1.916c-0.419-0.238,0.56,0.439,0.56-0.401l-0.725-3.947l2.863-2.759C16.388,10.604,16.254,10.22,15.94,10.179M10.381,2.778h3.902l-1.536,6.977L12.036,9.66l-1.655-3.546V2.778z M5.717,2.778h3.903v3.335L7.965,9.66L7.268,9.753L5.717,2.778zM12.618,13.182c-0.092,0.088-0.134,0.217-0.11,0.343l0.615,3.356l-2.938-1.629c-0.057-0.03-0.122-0.048-0.184-0.048c-0.063,0-0.128,0.018-0.185,0.048l-2.938,1.629l0.616-3.356c0.022-0.126-0.019-0.255-0.11-0.343l-2.441-2.354l3.329-0.441c0.128-0.017,0.24-0.099,0.295-0.215l1.435-3.073l1.435,3.073c0.055,0.116,0.167,0.198,0.294,0.215l3.329,0.441L12.618,13.182z"></path>
                                </svg>
                                <span className="zl_pagesidebar_text">Referrals</span>
                            </Link>
                        </li> */}

                        <li className="zl_page_sidebar_items" title="accountsupport">
                            <Link to={'/accountsupport'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/019-chat.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Support</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="settings">
                            <Link to={'/settings'} onClick={handleToggleMobile} className="zl_page_sidebar_link position-relative">
                                <img src="/assets/svg-icons/001-gear.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Settings</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="logout">
                            <div onClick={handleLogOut} className="zl_page_sidebar_link position-relative" style={{ cursor: 'pointer' }}>
                                <img src="/assets/svg-icons/033-poweron.svg" className="mr-15" width="20" height="20"></img>
                                <span className="zl_pagesidebar_text">Logout</span>
                            </div>
                        </li>
                    </ul>
                    <button className="zl_page_sidebar_toggle_icon" onClick={handleToggle}>
                        <img src="/assets/image/right-two-arrow.svg" alt="right-two-arrow" />
                    </button>
                </div>
            </section>
            <button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </>
    );
}

export default Header;
