import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

const TokenoftrustModule = ({ props }) => {

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

    const getToken = (e) => {

        e.preventDefault();



        // get tot token
        (async () => {

            console.log('test');

            let res = await userService.gettottoken();

            console.log(res);

            if (res.status === true) {
                setState({ tottoken: res.token });
            }

        })();

    };

    // yea, i know it's wrong. 
    var render = render;

    render();

    const isLoggedIn = state.isLoggedIn;

    if (isLoggedIn === true) {

        if (state.user && (state.user.pricingplan === 'elite' || state.user.pricingplan === 'extreme')) {

            if (state.tottoken && state.tottoken != '') {
                setTimeout(function () {
                    window.tot('embedsInitialize');
                }, 10);
            }

            return (
                <div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Token of Trust KYC</h6>
                    </div>

                    <div className="card-body pt-0 px-0 mb-4">
                        {state.tottoken && state.tottoken != '' ? (
                            <div data-tot-widget="accountConnector" data-tot-access-token={state.tottoken || ''}></div>
                        ) : (
                            <center><button onClick={e => getToken(e)} className='btn btn-success'>Start KYC</button></center>
                        )}
                    </div>
                </div>
            );

        }
        else {

            return (
                <div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Token of Trust KYC</h6>
                    </div>

                    <div className="card-body pt-0 px-0 mb-4">
                        <center>You are not currently on a plan that requires KYC</center>
                    </div>
                </div>
            );

        }

    }
    else {

        return (
            <div />
        );

    }
}



export default TokenoftrustModule;