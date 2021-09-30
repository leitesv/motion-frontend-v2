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

    const handlePassFormChange = event => {

        store.dispatch(updateStore({ key: 'password', value: event.target.value }));

    };

    const doGetPassphrase = (e) => {

        e.preventDefault();

        (async () => {

            if (state.password) {
                let res = await userService.getpassphrase({ password: state.password });

                if (res.status === true) {

                    let passphrase = res.message;

                    let phrasearray = passphrase.split(' ');

                    if (phrasearray.length === 12) {

                        setState({ modalType: 'recordkeys' });

                        let modaldata = '';

                        for (let i = 0; i < phrasearray.length; i++) {
                            modaldata += "<h5>Word #" + (i + 1) + ":  <strong>" + phrasearray[i] + "</strong></h5>";
                        }

                        store.dispatch(updateStore({ key: 'modalData', value: modaldata }));
                        store.dispatch(updateStore({ key: 'modalButton', value: 'I Have Written Down' }));
                        store.dispatch(updateStore({ key: 'modalTitle', value: 'Your BIP39 Passphrase' }));
                        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

                        store.dispatch(updateStore({ key: 'password', value: null }));

                    }
                    else {

                        toast.error('Error Decrypting Passphrase.  Check Password');

                    }

                }
                else {

                    toast.error(res.message);

                }
            }

        })();

    };
    // I have no idea what im doing here

    const dateString = state.user.lastlogin_date;
    const options = { year: "numeric", month: "long", day: "numeric" };
    var formatDate = new Date(dateString).toLocaleDateString('us', options);

    var formatDateBill = new Date(state.user.nextbillingdate).toLocaleDateString('us', options);

    var plan = state.user.pricingplan ? state.user.pricingplan.toUpperCase() : '';

    const isLoggedIn = state.isLoggedIn;

    if (isLoggedIn === true && state.user && state.user.bip39_user_recorded === false) {

        return (
            <div className="card text-left mt-2">
                <div className="card-header">
                    <h6 className="subtitle mb-0">
                        <div className="avatar avatar-40 bg-primary-light text-primary rounded mr-2"><span className="material-icons vm">warning</span></div>
                        Important Notice to Users
                    </h6>
                </div>
                <div className="card-body ">
                    By design, Qredit Motion <strong>DOES NOT</strong> have access to your ecrypted private keys stored on our system.  All keys are strongly encrypted using your login password.  We only store a Bcrypt hash of your password, which means we can not decrypt your keys without you providing the decryption password.  If you lose your login credentials, the <strong>ONLY</strong> way to restore access to your account is using your BIP39 passphrase.  Therefore, you should <strong>WRITE DOWN AND SAFELY STORE</strong> your passphrase before doing any activity on Qredit Motion.
                    <br /><br />

                    <div className="input-group mb-3">
                        <input onChange={handlePassFormChange} type="password" autoComplete="new-password" className="form-control" placeholder="Password" aria-label="Password" value={state.password || ''} />
                        <div className="input-group-append">
                            <button onClick={e => doGetPassphrase(e)} className="btn btn-outline-secondary" type="button">Get Phrase</button>
                        </div>
                    </div>

                </div>
            </div>
        );

    }
    else {


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
                                                    <h3 className="cardtitle fixcolor">Total Cash Value</h3>
                                                    <p className="cardsub">€ 0</p>
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
}



export default connect(null, null)(DashboardModule);
