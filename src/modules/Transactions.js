import React from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WalletDetails from '../components/Layout/TransactionListComponent/main';
import { toast } from 'react-toastify';

import store from "../store/index";
import { updateStore } from "../store/actions/index";

import copy from "copy-to-clipboard";

// SERVICES
import userService from '../services/userService';


const TransactionsModule = ({ props }) => {
    const [state, setState] = React.useState({ user: {} });

    React.useEffect(() => {
        // Runs after the first render() lifecycle


        (async () => {

            let res = await userService.get();

            //console.log(res);

            if (res.status === true) {
                store.dispatch(updateStore({ key: 'user', value: res.user }));
                setState(store.getState());

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

/*
    const refresh = () => {

        (async () => {

            setState({ isFetching: true, shownItems: 20 });
            
            let res = await userService.getalltransactions(0, 20);

            if (res.status === true) {
            	setState({ 'transactionlist': res.transactionlist });
                setState({ 'hasMore': res.hasmore });
            }

            setState({ isFetching: false });

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems || 10;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            let res = await userService.getalltransactions(skip, limit);

            if (res.status === true) {

                let newhistory = state.transactionlist.concat(res.transactionlist);

                setState({ 'transactionlist': newhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const getType = (type) => {

        var typetext = '';

        if (type === 0) typetext = 'Transfer';
        if (type === 1) typetext = 'SigReg';
        if (type === 2) typetext = 'DelReg';
        if (type === 3) typetext = 'Vote';
        if (type === 4) typetext = 'Multisig';
        if (type === 5) typetext = 'IPFS';
        if (type === 6) typetext = 'MultiTransfer';
        if (type === 7) typetext = 'DelResign';
        if (type === 8) typetext = 'HTLC';

        if (type === 20) typetext = 'Transfer';
        if (type === 21) typetext = 'Change';

        return typetext;

    };

    const doCopyAddress = (e, address) => {

        e.preventDefault();

        copy(address);

        toast.success('Address Copied to Clipboard');

    };

    const doCopyTxid = (e, txid) => {

        e.preventDefault();

        copy(txid);

        toast.success('Transaction ID Copied to Clipboard');

    };

    const transactionlist = state.transactionlist || [];

    const viewTransaction = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.gettransaction(state.walletid, id);

            if (res.status === true) {

                console.log(res);

                var transactionitem = res.transaction;

                var vList = '';

                if (transactionitem.details.asset && transactionitem.details.asset.votes) {

                    vList = transactionitem.details.asset.votes.length > 0
                        && transactionitem.details.asset.votes.map((item, i) => {
                            return (
                                <p className="small text-secondary mb-0">{item}</p>
                            )
                        }, this);

                }

                setState({ modalType: 'viewtx' });

                let modalData = (
                    <div className="row">
                        <div className="col">
                            <p className="small text-secondary mb-0"><strong>TXID:</strong>&nbsp;{transactionitem.txid}</p>
                            <p className="small text-secondary mb-0"><strong>Direction:</strong>&nbsp;{transactionitem.direction}</p>
                            <p className="small text-secondary mb-0"><strong>Amount:</strong>&nbsp;{transactionitem.details.amount / 100000000}</p>
                            <p className="small text-secondary mb-0"><strong>Fee:</strong>&nbsp;{parseInt(transactionitem.details.fee) / 100000000}</p>
                            <p className="small text-secondary mb-0"><strong>Timestamp:</strong>&nbsp;{transactionitem.details.timestamp.human.substr(0, 19).replace('T', ' at ')}</p>
                            <p className="small text-secondary mb-0"><strong>Sender:</strong>&nbsp;{transactionitem.details.sender}</p>
                            <p className="small text-secondary mb-0"><strong>Recipient:</strong>&nbsp;{transactionitem.details.recipient}</p>
                            <p className="small text-secondary mb-0"><strong>Type:</strong>&nbsp;{getType(transactionitem.details.type)}</p>
                            <p className="small text-secondary mb-0"><strong>BlockHeight:</strong>&nbsp;{transactionitem.details.blockHeight}</p>
                            <p className="small text-secondary mb-0"><strong>BlockID:</strong>&nbsp;{transactionitem.details.blockId}</p>
                            {(transactionitem.details.asset && transactionitem.details.asset.votes) ? (
                                <><p className="small text-secondary mb-0"><strong>Votes:</strong></p>{vList}</>
                            ) : ''}

                        </div>
                    </div>
                );

                store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
                store.dispatch(updateStore({ key: 'modalData', value: null }));
                store.dispatch(updateStore({ key: 'modalButton', value: null }));
                store.dispatch(updateStore({ key: 'modalTitle', value: 'View Transaction' }));
                store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

            }

        })();

    };
    
    */
    var wallets = state.user.wallets || [];
    
    return (
        <>
            <section className="zl_wallets_page zl_history_pagexx">

                <HeadingModule name={'Transactions'} />
                <Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
                    <div className="zl_add_currency_content">
                        <h3 className="zl_bottom_content_heading">Activities</h3>
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


export default connect(null, null)(TransactionsModule);
