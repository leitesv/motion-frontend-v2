import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav } from 'react-bootstrap';

// SERVICES
import userService from '../services/userService';


const QSLP1Module = ({ props }) => {

    const [state, setState] = React.useState({ user: {} });

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });
            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();


    }, []);

    return (
        <>
            <section className="zl_history_page">
                <HeadingModule name={'Tokens'} />
                <Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
                    <div className="zl_add_currency_content">
                        <h3 className="zl_bottom_content_heading">Tokens</h3>
                        <Nav className="zl_add_currency_row row">
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="qredit" className="zl_add_currency_inner_content tokens-card-qredit">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>Qredit QSLP-1</h3>
                                            <p className="white">0 Token Types</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="ark" className="zl_add_currency_inner_content tokens-card-ark">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_price">
                                            <div className="zl_add_currency_left_price">
                                                <h3>ARK QSLP-1</h3>
                                                <p className="white">0 Token Types</p>
                                            </div>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <Tab.Content className="center-center">
                        <Tab.Pane eventKey="qredit">
                            <h3>Qredit QSLP-1 Tokens</h3>
                            <div className="row center-center">
                                <button className="button-priceplan" type="button">Create Tokens</button>
                                <button className="button-priceplan" type="button">Send Tokens</button>
                                <button className="button-priceplan" type="button">Receive Tokens</button>
                                <button className="button-priceplan" type="button">View Tokens</button>
                            </div>
                            <div className="container">
                                <p> Or make same as "wallets" page. But instead of "Send Qredit", it will be "Select Token + Select Amount + Send" </p>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="ark">
                            <p>ark</p>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </section>
        </>
    );
}

export default connect(null, null)(QSLP1Module);