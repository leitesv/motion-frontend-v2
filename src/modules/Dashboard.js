import React, { useState } from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import "react-datepicker/dist/react-datepicker.css";
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
import { Tab, Nav } from 'react-bootstrap';
import copy from "copy-to-clipboard";
// SERVICES
import userService from '../services/userService';

// import { mapStateToProps } from './mappers';

const DashboardModule = (props) => {

    //const [state, setState] = React.useState({ user: {} });
    const [state, setState] = React.useState(store.getState());

    React.useEffect(() => {
        // Runs after the first render() lifecycle

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });

                store.dispatch(updateStore({ key: 'user', value: res.user }));

                if (!state.userImages.userid) {

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

    const doCopyThis = (e, crypto_balance) => {

        e.preventDefault();

        copy(crypto_balance);

        toast.success('Transaction ID Copied to Clipboard');

    };

    // I have no idea what im doing here

    const dateString = state.user.lastlogin_date;
	const options = { year: "numeric", month: "long", day: "numeric" };
	var formatDate = new Date(dateString).toLocaleDateString('us', options);

	var formatDateBill = new Date(state.user.nextbillingdate).toLocaleDateString('us', options);

	var plan = state.user.pricingplan?state.user.pricingplan.toUpperCase():'';


    return (
        <>
            <section className="zl_dashboard_page">

                <HeadingModule name={'Dashboard'} />
                <div className="row">
                    <div className="col text-center">
                        <h5 className="subtitle primary-color">Hi {state.user ? state.user.givenname : ''}!</h5>
                        <p className="text-secondary">How are you doing today?</p>
                    </div>
                </div>
                <section className="zl_history_page">
                    <Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
                        <div className="zl_add_currency_content">
                            <Nav className="zl_add_currency_row row justify-content-center">
                                <Nav.Item className="zl_add_currency_column col">
                                    <Nav.Link to={'/wallets'} className="zl_add_currency_inner_content">
                                        <div className="zl_add_currency_price text-center cardblock">
                                            <div className="text-center">
                                                <h3 className="cardtitle fixcolor">Total Crypto Value</h3>
                                                <p className="cardsub">€{state.user ? parseInt(state.user.crypto_balance) : ''}</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="zl_add_currency_column col">
                                    <Nav.Link className="zl_add_currency_inner_content">
                                        <div className="zl_add_currency_price text-center cardblock">
                                            <div className="text-center">
                                                <h3 className="cardtitle fixcolor">Your Last Login</h3>
                                                <p className="cardsub">{(formatDate)}</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="zl_add_currency_column col">
                                    <Nav.Link className="zl_add_currency_inner_content">
                                        <div className="zl_add_currency_price text-center cardblock">
                                            <div className="text-center">
                                                <h3 className="cardtitle fixcolor">Your Next Billing Date</h3>
                                                <p className="cardsub">{formatDateBill}</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="zl_add_currency_column col">
                                    <Nav.Link className="zl_add_currency_inner_content">
                                        <div className="zl_add_currency_price text-center cardblock">
                                            <div className="text-center">
                                                <h3 className="cardtitle fixcolor">Your Current Subscription</h3>
                                                <p className="cardsub">{plan}</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </Tab.Container>
                </section>
            </section>
        </>
    );
}

export default connect(null, null)(DashboardModule);
