import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { updateStore } from "../store/updateStore";
import store from "../store/index";
import { useHistory } from "react-router-dom"

import Form from 'react-bootstrap/Form';
// SERVICES
import userService from '../services/userService';

const PersonaModule = ({ props }) => {

    const [state, setState] = React.useState(store.getState());

	let history = useHistory()
	
    React.useEffect(() => {
        // Runs after the first render() lifecycle

        (async () => {

            let res = await userService.get();

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
                history.push('/login/');

            }

        })();


    }, []);



    return (
    
    	<>
            <section className="zl_settings_page">
                <HeadingModule name={'Persona / KYC'} />
                <div className="zl_setting_list">


                    <h3 className="zl_bottom_content_heading">Persona / KYC</h3>
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>View Pending Requests (0)</h3>
                            <p>View pending permission requests for your Persona profile.</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
                    
                    
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Your Persona Profile</h3>
                            <p>Complete your Persona Profile.</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
                    
                    
                </div>
            </section>
    	</>

    );
}

export default connect(null, null)(PersonaModule);