import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import SelectCurrency from 'react-select-currency';

import ReactLanguageSelect from 'react-languages-select';

// modals
import Loginhistory from './LoginHistory';

import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';



const SettingModule = ({ themHandler, props }) => {

    const [state, setState] = React.useState(store.getState());

    React.useEffect(() => {
        // Runs after the first render() lifecycle

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });

                store.dispatch(updateStore({ key: 'user', value: res.user }));

                if (!state.userImages || !state.userImages.userid) {

                    let resi = await userService.getimages();

                    if (resi.status === true) {
                        store.dispatch(updateStore({ key: 'userImages', value: resi.userimages }));
                    }

                }

            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();


    }, []);

    const setCurrentItem = (e, item) => {

        e.preventDefault();

        if (state.appservicesItem === item) {
            store.dispatch(updateStore({ key: 'appservicesItem', value: null }));
        }
        else {
            store.dispatch(updateStore({ key: 'appservicesItem', value: item }));
        }

    };

    const [color, setColor] = useState(localStorage.getItem("themColor") === "false" ? false : localStorage.getItem("themColor") !== null && true);

    const handleLogOut = (event) => {

        localStorage.removeItem("accessToken");
        toast.success("You have been logged out");

    };

    const onSelectedCurrency = currencyAbbrev => {

		(async () => {

/*
			let res = await userService.setlanguage(language);

			if (res.status === true)
			{
			
				toast.success('Language Setting Updated: ' + language);
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}
*/

		})();

    }

    const onSelectLanguage = language => {

		(async () => {

			let res = await userService.setlanguage(language);

			if (res.status === true)
			{
			
				toast.success('Language Setting Updated: ' + language);
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}

		})();

    }
    
    return (
        <>
            <section className="zl_settings_page">
                <HeadingModule name={'Settings'} />
                <div className="zl_setting_list">


                    <h3 className="zl_bottom_content_heading">Qredit Motion</h3>
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Currency</h3>
                            <p>Set your preferred local currency.</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                        
                			<SelectCurrency value={'EUR'} onCurrencySelected={onSelectedCurrency} />

                        </div>
                    </div>
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Language</h3>
                            <p>Set your preferred language</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                        
							<ReactLanguageSelect
								defaultLanguage={state.user.preferred_language}
								searchable={true}
								searchPlaceholder="Search for a language"
								onSelect={onSelectLanguage}
							 />

                        </div>
                    </div>
                    <Link to={'/priceplan'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Priceplan</h3>
                            <p>Modify Subscription</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    {/*<Link to={'/persona'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Persona / KYC</h3>
                            <p>Manage Persona</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                     </Link> */}
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Change Theme</h3>
                            <p>Enable or Disable Dark Mode</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            checked={color}
                            onChange={() => {
                                setColor(!color);
                                themHandler(color);
                            }}
                        />
                    </div>


                    <h3 className="zl_bottom_content_heading">Personal</h3>
                    <Link to={'/myaddresses'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>My Addresses</h3>
                            <p>Change Addresses</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link to={'/myphonernumbers'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>My Phone Numbers</h3>
                            <p>Manage Phone Numbers</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <h3 className="zl_bottom_content_heading">Advanced Features</h3>
                    <Link to={'/swapoldxqr'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Swap Old XQR</h3>
                            <p>Swap your old XQR coins</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <h3 className="zl_bottom_content_heading">About</h3>
                    <Link to={'/privacypolicy'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Privacy Policy</h3>
                            <p>View Privacy Policy</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link to={'/termsandconditions'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Terms and Conditions</h3>
                            <p>View Terms and Conditions</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <h3 className="zl_bottom_content_heading">Security</h3>
                    <Link to={'/securitysettings'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Security Settings</h3>
                            <p>Password and Devices</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link to={'/twofactorauthentication'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Two Factor Authentication</h3>
                            <p>Enable or Disable</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <a onClick={e => setCurrentItem(e, 'loginhistory')} href="/" className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Login History</h3>
                            <p>Account Login History</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </a>
                    <Loginhistory />

                    <Link to={'/getbip39'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Get BIP39 Passphrase</h3>
                            <p>Unlock & View Passphrase</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link to={'/accountsupport'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3 style={{ color: 'red' }}>Close Account</h3>
                            <p>Close your Account</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link onClick={handleLogOut} to={'/login'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Logout</h3>
                            <p>Logout from the application</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                </div>
            </section>
        </>
    );
}

export default connect(null, null)(SettingModule);
