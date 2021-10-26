import React from "react";
import { Tab, Nav } from 'react-bootstrap';
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

import store from "../store/index";
import { updateStore } from "../store/updateStore";
// SERVICES
import userService from '../services/userService';

// import Swiper core and required components
import SwiperCore, { Navigation, EffectCoverflow, Virtual } from 'swiper';
import ReactTooltip from 'react-tooltip';


SwiperCore.use([EffectCoverflow, Navigation, Virtual]);

const PricePlanModule = ({ props }) => {

    const [state, setState] = React.useState({ user: {} });

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
                setState({ user: res.user });
            }

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();

    }, []);

    const setYearly = (e) => {
        e.preventDefault();
        store.dispatch(updateStore({ key: 'yearlyplans', value: true }));
        store.dispatch(updateStore({ key: 'monthlyplans', value: false }));
    };

    const setMonthly = (e) => {
        e.preventDefault();
        store.dispatch(updateStore({ key: 'yearlyplans', value: false }));
        store.dispatch(updateStore({ key: 'monthlyplans', value: true }));
    };

    const doSelectDowngradePlan = () => {

        (async () => {

            var plan = state.selectedPlan;

            var type = 'monthly';
            if (state.yearlyplans === true) {
                type = 'yearly';
            }

            let data = {
                plan: plan,
                period: type,
                amount: 0.00
            };

            let res = await userService.selectdowngradeplan(data);

            if (res.status === true) {
                store.dispatch(updateStore({ key: 'user', value: res.user }));
                toast.success(res.message);
            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const doBuyCoinPayments = () => {

        (async () => {

            var type = 'monthly';
            if (state.yearlyplans === true) {
                type = 'yearly';
            }

            var plan = state.selectedPlan;

            var amount = state.amountDue;

            var ticker = document.getElementById("selectcurrency").value;


            let data = {
                plan: plan,
                period: type,
                amount: amount,
                ticker: ticker
            };

            let res = await userService.createcoinpaymentsorder(data);

            if (res.status === true) {

                console.log(res.checkouturl);

                window.open(res.checkouturl, '_blank');

            }
            else {

                toast.error(res.message);

            }

        })();

    };


    const doBuy = (e, plan) => {
        e.preventDefault();

        /*
        var type = 'monthly';
        if (state.yearlyplans === true)
        {
            type = 'yearly';
        }
        */

        (async () => {

            setState({ dobuyloading: true });

            var type = 'yearly';

            store.dispatch(updateStore({ key: 'selectedPlan', value: plan }));


            let res = await userService.upgradeplan(plan);

            if (res.status === false) {

                toast.error(res.message);

            }
            else {

                var amount = 0;

                if (res.type === 'upgrade') {
                    amount = res.prorataprice;
                }

                store.dispatch(updateStore({ key: 'amountDue', value: amount }));


                let ucplan = plan[0].toUpperCase() + plan.slice(1);
                let uctype = type[0].toUpperCase() + type.slice(1);



                if (amount > 0) {

                    // It's an upgrade

                    var paymentinfo = "Amount Due: €" + amount;
                    if (res.isprorated === true) paymentinfo += " (Prorated credit applied)";

                    paymentinfo += "<br />Plan Price: €" + res.newplanprice + " /" + (type === 'monthly' ? 'mo' : 'year');

                    paymentinfo += "<br />Your new plan will take effect immediately<hr>";

                    paymentinfo += "Payment Options:<br /><br />";

                    //store.dispatch( updateStore({ key: 'bottombutton1text', value: "Pay with Credit Card" }) );

                    //paymentinfo += "<button id='bottombutton1'></button><br /><br />";

                    if (type === 'yearly') {

                        store.dispatch(updateStore({ key: 'bottombutton2text', value: "Pay with Cryptocurrency" }));


                        paymentinfo += `<div className="btn-group">
									<button id="bottombutton2" type="button" className="btn"></button>
									<div className="btn-group dropup">
										<select class='select' id="selectcurrency">
											<option value="BTC">BTC</a>
											<option value="ETH">ETH</a>
											<option value="LTC">LTC</a>
											<option value="DASH">DASH</a>
											<option value="USDT">USDT</a>
										</select>
									</div>
								</div>`;

                    }

                }
                else {

                    var paymentinfo = "Amount Due: €" + amount;
                    paymentinfo += "<br />Plan Price: €" + res.newplanprice + " /" + (type === 'monthly' ? 'mo' : 'year');

                    paymentinfo += "<br />Your new plan will take effect on " + res.nextbilldate.substr(0, 10) + "<hr>";

                    store.dispatch(updateStore({ key: 'bottombutton3text', value: "Select Plan" }));

                    paymentinfo += "<button id='bottombutton3'></button><br /><br />";

                }

                setState({ dobuyloading: false });

                store.dispatch(updateStore({ key: 'bottomUpHeader', value: ucplan + ' ' + uctype + " Plan" }));
                store.dispatch(updateStore({ key: 'bottomUpInfo', value: paymentinfo }));
                store.dispatch(updateStore({ key: 'bottomupactive', value: true }));

            }

        })();

    };
    /*
        var initialslide = 0;
    
        if (state.user && (state.user.pricingplan === 'pro' || state.user.pricingplan === 'corppro')) {
            initialslide = 1;
        }
        else if (state.user && (state.user.pricingplan === 'extreme' || state.user.pricingplan === 'corpextreme')) {
            initialslide = 2;
        }
        else if (state.user && (state.user.pricingplan === 'epic' || state.user.pricingplan === 'corpepic')) {
            initialslide = 3;
        }
    
    
        if (state.user && (!state.user.pricingplan || state.requestedPage === 'pricingplan')) {
    
    
            /*
                                    <div className="row justify-content-center mt-4">
                                        <div id="monthly-yearly-chenge" className="custom-change">
                                            <a onClick={ e => setMonthly(e) } href="/" className={"monthly-price f-size12 " + (state.monthlyplans?'active':'')}> <span className="change-box-text">monthly</span> <span className="change-box"></span></a>
                                            <a onClick={ e => setYearly(e) } href="/" className={"yearli-price f-size12 " + (state.yearlyplans?'active':'')}> <span className="change-box-text">annually</span></a>
                                        </div>
                                    </div>
            */


    var plans = state.plans || [];
    var defaultActiveKey = state.user.pricingplan || [];


    return (



        <section className="zl_history_page">

            <HeadingModule name={'Subscription'} />
            <div className="zl_SecureBackup_heading">
                <h3>Priceplan</h3>
            </div>
            <Tab.Container id="left-tabs-example" defaultActiveKey={defaultActiveKey}>
                <div className="zl_add_currency_content center-center">
                    <h3 className="zl_bottom_content_heading">Your Current Plan: <strong style={{ textTransform: 'uppercase' }}>{state.user.pricingplan || 'N/A'}</strong></h3>
                    <h3 className="zl_bottom_content_heading">Billing renewal date: <strong>{state.user.nextbillingdate ? state.user.nextbillingdate.substr(0, 10) : 'N/A'}</strong></h3>
                </div>
                <div className="zl_add_currency_content">
                    <Nav className="zl_add_currency_row row">
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="lite" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Lite Plan</h3>
                                        <p className="cardsub">Free</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="pro" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Pro Plan</h3>
                                        <p className="cardsub">€ 24.95 per year</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="extreme" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Extreme Plan</h3>
                                        <p className="cardsub">€ 79.95 per year</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="epic" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Epic Plan</h3>
                                        <p className="cardsub">€ 149.95 per year</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <ReactTooltip />
                <Tab.Content className="center-center">
                    <Tab.Pane eventKey="lite">
                        <div className="col-lg-12 col-md-12 ml-auto mr-auto mt-15">
                            <div className="card card-coin card-plain">
                                <div className="card-header">
                                    <h4 className="title text-center">Lite Plan</h4>
                                    <h2 className="text-center">Free</h2>
                                    <h6 className="text-center">no hidden costs</h6>
                                    <button className="button-priceplan" type="button">Subscribe</button>
                                </div>
                                <div className="card-body">
                                    <ul>
                                        <p className="pricing-item" data-tip="placeholdertooltip">No KYC Required</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Crypto Payments</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Persona Passport</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Tokenized Euro Wallet</p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="pro">
                        <div className="col-lg-12 col-md-12 ml-auto mr-auto mt-15">
                            <div className="card card-coin card-plain">
                                <div className="card-header">
                                    <h4 className="title text-center">Pro Plan</h4>
                                    <h2 className="text-center">€ 24.95</h2>
                                    <h6 className="text-center">per year</h6>
                                    <button className="button-priceplan" type="button">Subscribe</button>
                                </div>
                                <div className="card-body">
                                    <ul>
                                        <p className="pricing-item" data-tip="placeholdertooltip">KYC Required</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Crypto Payments</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Persona Passport</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Tokenized Euro Wallet</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Open Banking</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">IBAN Account</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">SEPA Transfers</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">International Spending</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Priority Support</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">1 Virtual Debit Card</p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="extreme">
                        <div className="col-lg-12 col-md-12 ml-auto mr-auto mt-15">
                            <div className="card card-coin card-plain">
                                <div className="card-header">
                                    <h4 className="title text-center">Extreme Plan</h4>
                                    <h2 className="text-center">€ 79.95</h2>
                                    <h6 className="text-center">per year</h6>
                                    <button className="button-priceplan" type="button">Subscribe</button>
                                </div>
                                <div className="card-body">
                                    <ul>
                                        <p className="pricing-item" data-tip="placeholdertooltip">KYC Required</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Crypto Payments</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Persona Passport</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Tokenized Euro Wallet</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Open Banking</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">IBAN Account</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">SEPA Transfers</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">International Spending</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Priority Support</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">2 Virtual Debit Card</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">1 Plastic Debit Card</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Access to Loans</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Free International Payments</p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="epic">
                        <div className="col-lg-12 col-md-12 ml-auto mr-auto mt-15">
                            <div className="card card-coin card-plain">
                                <div className="card-header">
                                    <h4 className="title text-center">Epic Plan</h4>
                                    <h2 className="text-center">€ 149.95</h2>
                                    <h6 className="text-center">per year</h6>
                                    <button className="button-priceplan" type="button">Subscribe</button>
                                </div>
                                <div className="card-body">
                                    <ul>
                                        <p className="pricing-item" data-tip="placeholdertooltip">KYC Required</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Crypto Payments</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Persona Passport</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Tokenized Euro Wallet</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Open Banking</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">IBAN Account</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">SEPA Transfers</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">International Spending</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Priority Support</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">5 Virtual Debit Card</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">2 Plastic Debit Card</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Access to Loans</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">Free International Payments</p>
                                        <p className="pricing-item" data-tip="placeholdertooltip">1 Metal Debit Card</p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </section>
    );
}

export default connect(null, null)(PricePlanModule);