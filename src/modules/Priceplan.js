import React from "react";
import { Tab, Nav } from 'react-bootstrap';
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

import store from "../store/index";
import { updateStore } from "../store/updateStore";
import { Popover, OverlayTrigger, Dropdown } from 'react-bootstrap';
// SERVICES
import userService from '../services/userService';

// import Swiper core and required components
import SwiperCore, { Pagination, Navigation, EffectCoverflow, Virtual } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';


SwiperCore.use([EffectCoverflow, Navigation, Virtual]);

const PricePlanModule = ({ props }) => {

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


                        paymentinfo += `<div class="btn-group">
									<button id="bottombutton2" type="button" class="btn"></button>
									<div class="btn-group dropup">
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

    var initialslide = 0;
    var plans = state.plans || [];


    return (



        <section className="zl_history_page">

            <HeadingModule name={'Subscription'} />
            <div className="zl_SecureBackup_heading">
                <h3>Priceplan</h3>
            </div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="{state.user.pricingplan || 'N/A'}">
                <div className="zl_add_currency_content center-center">
                    <h3 className="zl_bottom_content_heading">Your Current Plan: <strong style={{ textTransform: 'uppercase' }}>{state.user.pricingplan || 'N/A'}</strong></h3>
                    <h3 className="zl_bottom_content_heading">Billing renewal date: <strong>{state.user.nextbillingdate ? state.user.nextbillingdate.substr(0, 10) : 'N/A'}</strong></h3>
                    {state.user.pricingplan !== null ? (
                        <>
                            Billing renewal date: <strong>{state.user.nextbillingdate ? state.user.nextbillingdate.substr(0, 10) : 'N/A'}</strong>
                        </>

                    ) : "Please Select a Plan"}
                </div>
                <div className="zl_add_currency_content">
                    <Nav className="zl_add_currency_row row">
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="tab1" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Lite Plan</h3>
                                        <p className="cardsub">Free</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="tab3" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Pro Plan</h3>
                                        <p className="cardsub">€ 24.95 per year</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="tab4" className="zl_add_currency_inner_content">
                                <div className="zl_add_currency_price text-center cardblock">
                                    <div className="text-center">
                                        <h3 className="cardtitle fixcolor">Extreme Plan</h3>
                                        <p className="cardsub">€ 79.95 per year</p>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="zl_add_currency_column col">
                            <Nav.Link eventKey="tab5" className="zl_add_currency_inner_content">
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
                <Tab.Content>
                    <h3 className="zl_bottom_content_heading">tab content goes here</h3><h3 className="zl_bottom_content_heading">tab content goes here</h3><h3 className="zl_bottom_content_heading">tab content goes here</h3><h3 className="zl_bottom_content_heading">tab content goes here</h3>
                </Tab.Content>
            </Tab.Container>
            <div className="card text-left mt-2">

                <div className="container pr-0 pl-0">

                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation
                        className="introduction text-white pb-5"
                        effect="coverflow"
                        preventClicks={false}
                        preventClicksPropagation={false}
                        onClick={(s, e) => { e.preventDefault() }}
                        initialSlide={initialslide}
                        virtual
                    >

                        {plans.map((planitem, index) => (

                            <SwiperSlide key={planitem.planid} virtualIndex={index} className="overflow-hidden text-center">
                                <div className="first-pricing-table" style={{ width: '90%', margin: 'auto' }}>
                                    <i className="fas fa-rainbow first-pricing-table-icon"></i>
                                    <h5 className="first-pricing-table-title">{planitem.name}
                                    </h5>
                                    <span style={{ textAlign: "center" }} className="plan-price second-pricing-table-price">
                                        {parseFloat(planitem.yearlyprice) === 0 ? planitem.iscustomplan === true ? (<i>Get Quote</i>) : (<i>FREE</i>) : (
                                            <i>€{parseFloat(planitem.yearlyprice).toFixed(2).replace('.', ',')} <span style={{ opacity: "0.5", fontSize: "14px" }}>/year</span></i>)}
                                    </span>
                                    <ul className="first-pricing-table-body">

                                        {index !== 0 ? (
                                            <li>Everything from {plans[index - 1]['name']} - <i>PLUS:</i></li>
                                        ) : ''}

                                        {planitem.hascryptowallets === true && (index === 0 || planitem.hascryptowallets !== plans[index - 1]['hascryptowallets']) ? (

                                            <>
                                                <OverlayTrigger key={0} overlay={<Popover id="popover-basic1">
                                                    <Popover.Title as="h3" style={{ color: "#000" }}>Crypto Payments</Popover.Title>
                                                    <Popover.Content>
                                                        Send and receive cryptocurrency transactions such as Qredit, Bitcoin, Litecoin, Ethereum, and more.
                                                    </Popover.Content>
                                                </Popover>}>
                                                    <li className='lilink'>Crypto Payments</li>
                                                </OverlayTrigger>

                                                <OverlayTrigger key={1} overlay={<Popover id="popover-basic1">
                                                    <Popover.Title as="h3" style={{ color: "#000" }}>Tokenized Euro Wallet</Popover.Title>
                                                    <Popover.Content>
                                                        Instantly send digital tokens pegged against the Euro currency.
                                                    </Popover.Content>
                                                </Popover>}>
                                                    <li className='lilink'>Tokenized Euro Wallet</li>
                                                </OverlayTrigger>
                                            </>

                                        ) : ''}

                                        {planitem.hasqreditpassport === true && (index === 0 || planitem.hasqreditpassport !== plans[index - 1]['hasqreditpassport']) ? (

                                            <OverlayTrigger key={2} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Qredit Passport</Popover.Title>
                                                <Popover.Content>
                                                    Your digital passport allows you to verify instantly at checkouts, websites or any supported 3rd party.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Qredit Passport</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasdedicatediban === true && (index === 0 || planitem.hasdedicatediban !== plans[index - 1]['hasdedicatediban']) ? (

                                            <OverlayTrigger key={3} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Dedicated IBAN Account</Popover.Title>
                                                <Popover.Content>
                                                    Send and receive funds anywhere in Europe with your dedicated SEPA/IBAN account.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Dedicated IBAN Account</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasaccesstoloans && (index === 0 || planitem.hasaccesstoloans !== plans[index - 1]['hasaccesstoloans']) ? (

                                            <OverlayTrigger key={4} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Access to loans up to €{planitem.hasaccesstoloans}</Popover.Title>
                                                <Popover.Content>
                                                    Create credibility and access direct flash loans up to €{planitem.hasaccesstoloans}. Repay within {planitem.loanrepaymentperiod} days. {planitem.loaninterest}% APR
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Access to loans up to €{planitem.hasaccesstoloans}</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasqreditinsurance === true && (index === 0 || planitem.hasqreditinsurance !== plans[index - 1]['hasqreditinsurance']) ? (

                                            <OverlayTrigger key={5} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Access to Qredit Insurance</Popover.Title>
                                                <Popover.Content>
                                                    Insure your mobile phone or vehicle with Qredit Insurance
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Access to Qredit Insurance</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasprioritysupport === true && (index === 0 || planitem.hasprioritysupport !== plans[index - 1]['hasprioritysupport']) ? (

                                            <OverlayTrigger key={6} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Priority Support</Popover.Title>
                                                <Popover.Content>
                                                    Priority Support 24/7
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Priority Support</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasvirtualdebitcards && (index === 0 || planitem.hasvirtualdebitcards !== plans[index - 1]['hasvirtualdebitcards']) ? (

                                            <OverlayTrigger key={7} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Virtual Debit Cards ({planitem.hasvirtualdebitcards})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.hasvirtualdebitcards} Virtual Debit Cards for online payments!
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Virtual Debit Cards ({planitem.hasvirtualdebitcards})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hasphysicaldebitcards && (index === 0 || planitem.hasphysicaldebitcards !== plans[index - 1]['hasphysicaldebitcards']) ? (

                                            <OverlayTrigger key={8} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Physical Debit Cards ({planitem.hasphysicaldebitcards})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.hasphysicaldebitcards} Physical Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Physical Debit Cards ({planitem.hasphysicaldebitcards})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hascorporatevirtualvisa && (index === 0 || planitem.hascorporatevirtualvisa !== plans[index - 1]['hascorporatevirtualvisa']) ? (

                                            <OverlayTrigger key={15} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Virtual Debit Cards ({planitem.hascorporatevirtualvisa})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.hasvirtualdebitcards} Corporate Virtual Debit Cards for online payments!
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Virtual Debit Cards ({planitem.hascorporatevirtualvisa})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hascorporateplasticvisa && (index === 0 || planitem.hascorporateplasticvisa !== plans[index - 1]['hascorporateplasticvisa']) ? (

                                            <OverlayTrigger key={16} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Physical Debit Cards ({planitem.hascorporateplasticvisa})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.hasphysicaldebitcards} Physical (Plastic) Corporate Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Physical Debit Cards ({planitem.hascorporateplasticvisa})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hascorporatemetalvisa && (index === 0 || planitem.hascorporatemetalvisa !== plans[index - 1]['hascorporatemetalvisa']) ? (

                                            <OverlayTrigger key={17} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Metal Debit Cards ({planitem.hascorporatemetalvisa})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.hascorporatemetalvisa} Physical (Metal) Corporate Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Metal Debit Cards ({planitem.hascorporatemetalvisa})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.founderscard && (index === 0 || planitem.founderscard !== plans[index - 1]['founderscard']) ? (

                                            <OverlayTrigger key={9} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Exclusive Qredit Founders Card ({planitem.founderscard})</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.founderscard} Qredit Founders Physical Debit Cards.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Exclusive Qredit Founders Card ({planitem.founderscard})</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.modelxdrawing === true && (index === 0 || planitem.modelxdrawing !== plans[index - 1]['modelxdrawing']) ? (

                                            <OverlayTrigger key={10} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Entry into Model X Drawing</Popover.Title>
                                                <Popover.Content>
                                                    Receive a free entry into the Tesla Model X drawing.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Entry into Model X Drawing</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.earlybirdxqrbonus && (index === 0 || planitem.earlybirdxqrbonus !== plans[index - 1]['earlybirdxqrbonus']) ? (

                                            <OverlayTrigger key={11} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Early Bird XQR Bonus: ({planitem.earlybirdxqrbonus} XQR)</Popover.Title>
                                                <Popover.Content>
                                                    Receive an early bird bonus of ({planitem.earlybirdxqrbonus} XQR into your Qredit Motion account automatically.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Early Bird XQR Bonus: ({planitem.earlybirdxqrbonus} XQR)</li>
                                            </OverlayTrigger>

                                        ) : ''}



                                        {planitem.hasmerchantplatform === true && (index === 0 || planitem.hasmerchantplatform !== plans[index - 1]['hasmerchantplatform']) ? (

                                            <OverlayTrigger key={12} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Merchant Payments Platform</Popover.Title>
                                                <Popover.Content>
                                                    Accept Payments in EUR or Cryptocurrencies
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Merchant Payments Platform</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.hascorporatepassport === true && (index === 0 || planitem.hascorporatepassport !== plans[index - 1]['hascorporatepassport']) ? (

                                            <OverlayTrigger key={13} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Qredit Corporate Passport</Popover.Title>
                                                <Popover.Content>
                                                    Your digital passport allows you to verify instantly at checkouts, websites or any supported 3rd party.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Qredit Corporate Passport</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.maxteammembers && (index === 0 || planitem.maxteammembers !== plans[index - 1]['maxteammembers']) ? (

                                            <OverlayTrigger key={14} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Up to {planitem.maxteammembers} team members</Popover.Title>
                                                <Popover.Content>
                                                    Up to {planitem.maxteammembers} team members
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Up to {planitem.maxteammembers} team members</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                        {planitem.iscustomplan ? (

                                            <OverlayTrigger key={18} overlay={<Popover id="popover-basic1">
                                                <Popover.Title as="h3" style={{ color: "#000" }}>Customized Plan to Fit Your Needs</Popover.Title>
                                                <Popover.Content>
                                                    Customized Plan to Fit Your Needs. A representative will contact you after you select this plan to help determine your needs.
                                                </Popover.Content>
                                            </Popover>}>
                                                <li className='lilink'>Customized Plan to Fit Your Needs</li>
                                            </OverlayTrigger>

                                        ) : ''}

                                    </ul>
                                    {state.user.pricingplan !== planitem.plancode ? (
                                        <li onClick={e => doBuy(e, planitem.plancode)} className="lilink first-pricing-table-order">{state.dobuyloading === true ? (<i className="fa fa-circle-o-notch fa-spin" />) : 'Select Plan'}</li>
                                    ) : (
                                        <li className="lilink first-pricing-table-order">Current Plan</li>
                                    )}
                                </div>
                            </SwiperSlide>

                        ))}




                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default connect(null, null)(PricePlanModule);