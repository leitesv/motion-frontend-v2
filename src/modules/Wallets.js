import React from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { Link } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
import WalletDetails from '../components/Layout/WalletComponent/main';
import { toast } from 'react-toastify';

import ReactTooltip from 'react-tooltip';
import copy from "copy-to-clipboard";
import store from "../store/index";
import { updateStore } from "../store/actions/index";
import Select from 'react-select';
import { useHistory } from "react-router-dom"

// SERVICES
import userService from '../services/userService';

const WalletsModule = ({ props }) => {

    const [state, setState] = React.useState(store.getState());

	let history = useHistory()

    React.useEffect(() => {


        (async () => {

            let res = await userService.get();

            if (res.status === true) {
            	store.dispatch( updateStore({ key: 'user', value: res.user }) );
                setState(store.getState());
                
                if (!state.userImages || !state.userImages.userid) {

                    let resi = await userService.getimages();

                    if (resi.status === true) {
                        store.dispatch(updateStore({ key: 'userImages', value: resi.userimages }));
                    }

                }
                
            }

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                history.push('/login/');

            }

        })();


    }, []);

    const createBankAccount = (e) => {

        e.preventDefault();



    };

    const createDebitCard = (e) => {

        e.preventDefault();



    };

    var wallets = state.user.wallets || [];
    var crypto = state.crypto || [];


    return (
        <>
            <ReactTooltip />
            <section className="zl_wallets_page">
                <HeadingModule name={'Wallets'} />
                <Tab.Container id="left-tabs-example">
                    <div className="zl_add_currency_content">

                        <h3 className="zl_bottom_content_heading" data-tip="Manage your bank accounts">bank accounts</h3>
                        <Nav className="zl_add_currency_row row">

                        </Nav>

                        <h3 className="zl_bottom_content_heading" data-tip="Manage your debit cards">debit cards</h3>
                        <Nav className="zl_add_currency_row row">

                        </Nav>

                        <h3 className="zl_bottom_content_heading" data-tip="Manage your crypto wallets">crypto currencies</h3>
                        <Nav className="zl_add_currency_row row">
                            <div className="zl_currency_column_sub_row">

                                {wallets.map((walletitem, index) => (
                                    <Nav.Item key={walletitem._id} className="zl_add_currency_column col">
                                        <Nav.Link eventKey={"tab" + walletitem._id} className="zl_add_currency_inner_content">
                                            <div className="zl_add_currency_icon_chart">

                                                <div className="zl_currency_icon zl_add_currency_price">
                                                    {walletitem.currencyid.logo !== null ? <img src={walletitem.currencyid.logo} style={{ width: '24px', height: '24px', marginRight: '5px' }} /> : ""}<p style={{ fontWeight: 'bold' }}>{walletitem.currencyid.name}</p>
                                                </div>

                                                <div className="zl_add_currency_price zl_add_currency_right_price">


                                                    <span>+0.0%</span>


                                                </div>

                                            </div>
                                            <div className="zl_add_currency_price">
                                                <div className="zl_add_currency_left_price">
                                                    <h3 className="fixcolor">{walletitem.currencyid.ticker}</h3>
                                                    <p className="mb-0">{parseFloat(walletitem.balance).toFixed(2)}</p>
                                                </div>

                                                <div className="zl_add_currency_price zl_add_currency_right_price" style={{ alignItems: 'flex-end', display: 'inline-block' }}>

                                                    <h3 className="fixcolor">Value</h3>
                                                    <p>€0.00</p>

                                                </div>

                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}


                            </div>
                            <div className="zl_add_currency_column zl_add_currency_btn_col col">
                                <Link to={'/addcurrency'} className="zl_add_currency_btn_content">
                                    + Add Currency
                                </Link>
                            </div>
                        </Nav>
                    </div>
                    <Tab.Content>
                        {wallets.map((item) => (
                            <Tab.Pane eventKey={`tab${item._id}`} key={item._id}>
                                <WalletDetails {...item} />
                            </Tab.Pane>
                        ))}
                    </Tab.Content>
                </Tab.Container>
            </section>
        </>
    );
}

export default connect(null, null)(WalletsModule);
