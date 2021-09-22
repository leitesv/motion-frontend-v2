import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav } from 'react-bootstrap';

// SERVICES
import userService from '../services/userService';


const CreateTokenModule = ({ props }) => {

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
                        <h3 className="zl_bottom_content_heading">Select Token Platform</h3>
                        <Nav className="zl_add_currency_row row">
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab2" className="zl_add_currency_inner_content zl_add_bitcoin_currency">
                                    <div className="zl_add_currency_icon_chart">
                                        {/* <img src="./assets/image/Bitcoin.svg" alt="currency-icon" /> */}
                                        <div className="zl_currency_icon">
                                            <svg viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.96 9.45191L13.9783 13.2264H19.3666C20.3236 13.2264 21.0992 12.4443 21.0944 11.4825L21.093 11.1958C21.0884 10.2338 20.3053 9.45191 19.3482 9.45191H14.6976H13.96ZM21.7786 18.9638L21.7771 18.6608C21.772 17.5879 20.8995 16.7168 19.8322 16.7168H19.3838H13.9955L14.0159 20.9079H19.8524C20.9198 20.9079 21.7838 20.0353 21.7786 18.9638ZM23.4886 14.6793C24.5609 15.6723 25.2408 17.0875 25.2484 18.6608L25.2499 18.9638C25.2645 21.9591 22.8506 24.3969 19.8692 24.3969H19.7373L19.7449 26H16.2735L16.2657 24.3969H14.8429L14.8507 26H11.3793L11.3715 24.3969H10.5611H8.83951L8.82256 20.9079H10.5442L10.5239 16.7168L10.5068 13.2264L10.4886 9.45189H8.76694L8.75 5.9616H11.282L11.2725 4H14.7439L14.7534 5.9616H16.1763L16.1667 4H19.6383L19.6478 5.97803C22.3731 6.14423 24.5513 8.41715 24.5648 11.1958L24.5661 11.4825C24.572 12.6866 24.1667 13.7932 23.4886 14.6793Z" fill="url(#paint0_linear)" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.96 9.45191L13.9783 13.2264H19.3666C20.3236 13.2264 21.0992 12.4443 21.0944 11.4825L21.093 11.1958C21.0884 10.2338 20.3053 9.45191 19.3482 9.45191H14.6976H13.96ZM21.7786 18.9638L21.7771 18.6608C21.772 17.5879 20.8995 16.7168 19.8322 16.7168H19.3838H13.9955L14.0159 20.9079H19.8524C20.9198 20.9079 21.7838 20.0353 21.7786 18.9638ZM23.4886 14.6793C24.5609 15.6723 25.2408 17.0875 25.2484 18.6608L25.2499 18.9638C25.2645 21.9591 22.8506 24.3969 19.8692 24.3969H19.7373L19.7449 26H16.2735L16.2657 24.3969H14.8429L14.8507 26H11.3793L11.3715 24.3969H10.5611H8.83951L8.82256 20.9079H10.5442L10.5239 16.7168L10.5068 13.2264L10.4886 9.45189H8.76694L8.75 5.9616H11.282L11.2725 4H14.7439L14.7534 5.9616H16.1763L16.1667 4H19.6383L19.6478 5.97803C22.3731 6.14423 24.5513 8.41715 24.5648 11.1958L24.5661 11.4825C24.572 12.6866 24.1667 13.7932 23.4886 14.6793Z" fill="#7781A2" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>Qredit QSLP-1</h3>
                                            <p>Create Token</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab3" className="zl_add_currency_inner_content zl_add_ethereum_currency">
                                    <div className="zl_add_currency_icon_chart">
                                        <div className="zl_currency_icon">
                                            <svg viewBox="0 0 17 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.48909 9.60596L0 13.2332L8.48909 17.9453L16.9748 13.2332L8.48909 9.60596Z" fill="#010101" fillOpacity="0.6" />
                                                <path className="left-shap" fillRule="evenodd" clipRule="evenodd" d="M0 13.2332L8.48909 17.9452V0L0 13.2332Z" fill="#96A0C2" />
                                                <path className="right-shap" fillRule="evenodd" clipRule="evenodd" d="M8.48926 0V17.9452L16.975 13.2332L8.48926 0Z" fill="#7680A0" />
                                                <path className="left-shap" fillRule="evenodd" clipRule="evenodd" d="M0 14.7444L8.48909 25.9805V19.4564L0 14.7444Z" fill="#96A0C2" />
                                                <path className="right-shap" fillRule="evenodd" clipRule="evenodd" d="M8.48926 19.4564V25.9805L16.9817 14.7444L8.48926 19.4564Z" fill="#7680A0" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_price">
                                            <div className="zl_add_currency_left_price">
                                                <h3>ARK QSLP-1</h3>
                                                <p>Create Token</p>
                                            </div>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </Tab.Container>
            </section>
        </>
    );
}

export default connect(null, null)(CreateTokenModule);