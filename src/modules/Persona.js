import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { updateStore } from "../store/updateStore";
import store from "../store/index";

import Form from 'react-bootstrap/Form';
// SERVICES
import userService from '../services/userService';

const PersonaModule = ({ props }) => {

    const [state, setState] = React.useState({ user: {} });

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });
            }

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();

    }, []);

    const toggleItem = (e, item) => {

        e.preventDefault();

        let defaultpersona = {
            reputationreport: false,
            profilereview: false,
            starrating: false,
            profilecomments: false,
            txvolume: false,
            addressdiscovery: false,
            mobilediscovery: false,
            emaildiscovery: false
        };

        let currentsettings = state.user.persona || defaultpersona;

        if (currentsettings[item] === true) {

            currentsettings[item] = false;

        }
        else {

            currentsettings[item] = true;

        }

        let user = state.user;
        user['persona'] = currentsettings;

        store.dispatch(updateStore({ key: 'user', value: user }));

        (async () => {

            await userService.savepersonasettings(currentsettings);

        })();
    }

    return (
        <section className="zl_settings_page">
            <HeadingModule name={'Persona Settings'} />
            <div className="zl_setting_list">

                <div className="card-body pt-0 px-0 mb-4">
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Reputation Report</h3>
                            <p>Users can see your KYC Reputation Report</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'reputationreport')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.reputationreport === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Profile Review</h3>
                            <p>Users can see your profile</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'profilereview')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.profilereview === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Profile Review</h3>
                            <p>Users can see your profile</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'starrating')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.starrating === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable profile comments</h3>
                            <p>Users can comment on your profile</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'profilecomments')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.profilecomments === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Transaction Volume</h3>
                            <p>Users can see the transaction volume of your account</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'txvolume')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.txvolume === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Address Discovery</h3>
                            <p>Users can find you by btc or any other crypto address</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'addressdiscovery')} style={{ cursor: 'pointer' }}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.addressdiscovery === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Mobile Discovery</h3>
                            <p>Users can find you by phone number</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'mobilediscovery')}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.mobilediscovery === true ? 'checked' : '')}
                        />
                    </div>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Enable Email Discovery</h3>
                            <p>Users can find you by email address</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            onClick={e => toggleItem(e, 'emaildiscovery')} style={{ cursor: 'pointer' }}
                            readOnly checked={(state.user && state.user.persona && state.user.persona.emaildiscovery === true ? 'checked' : '')}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}

export default connect(null, null)(PersonaModule);