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

// SERVICES
import userService from '../services/userService';

const WalletsModule = ({ props }) => {

    //const [state, setState] = React.useState({ user: {} });

    const [state, setState] = React.useState(store.getState());


    React.useEffect(() => {


        (async () => {

            let res = await userService.get();

            //console.log(res);

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
                props.history.push('/login/');

            }

        })();


    }, []);

/*
    const doModalSend = () => {

        //console.log('model button click');
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        var contactid = state.sendForm.send_contactid || null;
        var address = state.sendForm.send_address || null;
        var amount = state.sendForm.send_amount || null;
        var pass = state.sendForm.send_password || null;

        var error = false;

        if (isNaN(parseFloat(amount))) {
            error = true;
        }

        if (!isFinite(amount)) {
            error = true;
        }

        if (contactid == null && (address == null || address === '')) {
            error = true;
        }

        if (error === true) {

            toast.error('Form error');

        }
        else {

            (async () => {

                let res = await userService.sendtransaction(state.walletid, contactid, address, amount, pass);

                if (res.status === true) {

                    toast.success(res.message);

                }
                else {

                    toast.error(res.message);

                }

            })();

        }

    };

    const doModalVote = () => {

        //console.log('model button click');
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        var tovote = state.sendForm.send_vote;
        var pass = state.sendForm.send_password;

        var error = false;

        (async () => {

            let res = await userService.sendqreditvote(state.walletid, tovote, pass);

            if (res.status === true) {

                toast.success(res.message);

            }
            else {

                toast.error(res.message);

            }

        })();

    };

    const doModalRequest = () => {

        //console.log('model button click');
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        toast.success('request');


    };


    const goToWallet = (e) => {

        e.preventDefault();

        var walletid = e.target.id
        var color = e.target.dataset.color;
        var name = e.target.dataset.name;
        var ticker = e.target.dataset.ticker;
        var balance = e.target.dataset.balance;

        setState({ loadingwallet: true, walletid: walletid, walletcolor: color, walletname: name, walletticker: ticker, walletbalance: balance, walletaddresses: [] });

        // Load Wallet details

        (async () => {

            let res = await userService.getwalletaddresses(walletid);

            if (res.status === true) {
                setState({ walletaddresses: res.addresslist });
            }

            refresh();

            setState({ loadingwallet: false });

        })();

    };

    const goBack = (e) => {

        e.preventDefault();

        setState({ loadingwallet: false, walletid: null, walletcolor: null, walletname: null, walletticker: null, walletbalance: null, walletaddresses: [] });

    };
*/

    const refresh = () => {

        (async () => {

            setState({ shownItems: 10, initialLoad: true });

            let res = await userService.getwallettransactions(state.walletid, 0, 10);

            if (res.status === true) {
                setState({ 'transactionlist': res.transactionlist });
                setState({ 'hasMore': res.hasmore });
                setState({ 'initialLoad': false });

            }

            let resbal = await userService.getwalletbalance(state.walletid);

            if (resbal.status === true) {
                setState({ 'walletbalance': resbal.balance });
            }

            let resuser = await userService.get();

            if (resuser.status === true) {

                store.dispatch(updateStore({ key: 'user', value: resuser.user }));

            }


        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems || 10;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            let res = await userService.getwallettransactions(state.walletid, skip, limit);

            if (res.status === true) {

                let newhistory = state.transactionlist.concat(res.transactionlist);

                setState({ 'transactionlist': newhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

/*
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

    const doDeposit = (e) => {

        e.preventDefault();

        var topaddress = state.walletaddresses[0].address;

        copy(topaddress);
        toast.success('Address Copied to Clipboard');

        let modalData = (
            <div style={{ textAlign: 'center' }} >
                <Link value={topaddress} /><div style={{ marginTop: '10px' }}>{topaddress}</div>
            </div>
        );

        store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
        store.dispatch(updateStore({ key: 'modalData', value: null }));
        store.dispatch(updateStore({ key: 'modalButton', value: null }));
        store.dispatch(updateStore({ key: 'modalTitle', value: 'Deposit ' + state.walletticker }));
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

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

    const handleSendFormChange = event => {

        if (event.target.type === 'checkbox') {
            event.target.value = event.target.checked;
        }

        var currentSendForm = state.sendForm;

        currentSendForm[event.target.id] = event.target.value;

        setState({ sendForm: currentSendForm });


        var currentSendFormFeedback = state.sendFormFeedback;

        let feedbackname = event.target.id.replace('send_', '') + 'invalid';

        currentSendFormFeedback[feedbackname] = null;

        setState({ sendFormFeedback: currentSendFormFeedback });

    };

    const handleContactSendFormChange = selectedOption => {

        if (selectedOption !== null) {

            var currentSendForm = state.sendForm;

            currentSendForm['send_contactid'] = selectedOption.value;

            setState({ sendForm: currentSendForm });

            document.querySelector('#sendaddressfield').style.display = 'none';

        }
        else {

            var currentSendForm = state.sendForm;

            currentSendForm['send_contactid'] = null;

            setState({ sendForm: currentSendForm });

            document.querySelector('#sendaddressfield').style.display = 'block';

        }

    };

    const doSend = (e) => {

        e.preventDefault();

        (async () => {

            const userid = state.user._id || '';

            var colourOptions = [];

            let contacts = await userService.getcontacts(0, 100);

            if (contacts.status === true) {

                for (let i = 0; i < contacts.contactlist.length; i++) {

                    let thiscontact = contacts.contactlist[i];

                    let cvalue = userid === thiscontact.userid_b._id ? thiscontact.userid_a._id : thiscontact.userid_b._id;
                    let ccolor = "/api/profileimage/" + (userid === thiscontact.userid_b._id ? thiscontact.userid_a._id : thiscontact.userid_b._id);
                    let clabel = (userid === thiscontact.userid_b._id ? thiscontact.userid_a.givenname : thiscontact.userid_b.givenname) + ' ' + (userid === thiscontact.userid_b._id ? thiscontact.userid_a.familyname : thiscontact.userid_b.familyname) + ' (' + (userid === thiscontact.userid_b._id ? thiscontact.userid_a.email : thiscontact.userid_b.email) + ')';

                    let cdetails = { value: cvalue, color: ccolor, label: clabel };

                    colourOptions.push(cdetails);

                }

            }


            const dot = (color) => ({
                alignItems: 'center',
                display: 'flex',
                ':before': {
                    background: 'url(' + color + ')',
                    backgroundSize: 'contain',
                    borderRadius: 5,
                    content: '" "',
                    display: 'block',
                    marginRight: 8,
                    height: 30,
                    width: 30,
                    minWidth: 30
                },
            });

            const colourStyles = {
                control: styles => ({ ...styles }),

                option: (styles, { data, isDisabled, isFocused, isSelected }) => {

                    return {
                        ...styles,
                        ...dot(data.color),
                        backgroundColor: isDisabled
                            ? null
                            : isSelected
                                ? '#BBF'
                                : isFocused
                                    ? '#DDF'
                                    : null,
                        cursor: isDisabled ? 'not-allowed' : 'default',

                        ':active': {
                            ...styles[':active'],
                            backgroundColor:
                                !isDisabled && (isSelected ? '#FFF' : '#DDF'),
                        },
                    };
                },

                input: styles => ({ ...styles }),
                placeholder: styles => ({ ...styles }),
                singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
            };

            setState({ modalType: 'send' });


            let modalData = (
                <form className="was-validated">

                    <div className="form-group float-label position-relative active" style={{ zIndex: '99999' }}>

                        <Select
                            options={colourOptions}
                            styles={colourStyles}
                            isClearable={true}
                            isSearchable={true}
                            id="send_contact"
                            onChange={handleContactSendFormChange}
                        />

                        <label className="form-control-label text-white">Contact</label>
                    </div>


                    <div className="form-group float-label position-relative active" id='sendaddressfield'>
                        <input required id="send_address" type="text" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Address</label>
                    </div>

                    <div className="form-group float-label position-relative active">
                        <input required id="send_amount" type="text" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Amount</label>
                    </div>
                    <div className="form-group float-label position-relative active">
                        <input required id="send_password" type="password" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Password</label>
                    </div>

                </form>
            );

            store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
            store.dispatch(updateStore({ key: 'modalData', value: null }));
            store.dispatch(updateStore({ key: 'modalButton', value: 'Send' }));
            store.dispatch(updateStore({ key: 'modalTitle', value: 'Send ' + state.walletticker }));
            store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        })();
    };

    const doVote = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.getdelegatelist(state.walletid);

            let cvote = await userService.getwalletvotes(state.walletid);

            let dList = res.delegates.length > 0
                && res.delegates.map((item, i) => {
                    return (
                        <option key={i} value={item.publicKey} selected={cvote.vote === item.publicKey ? 'selected' : false}>{item.username}</option>
                    )
                }, this);

            setState({ modalType: 'vote' });


            if (cvote.vote) {
                var currentSendForm = state.sendForm;
                currentSendForm["send_vote"] = cvote.vote;
                setState({ sendForm: currentSendForm });

                let cvotename = '';

                for (let i = 0; i < res.delegates.length; i++) {
                    let ditem = res.delegates[i];
                    if (ditem.publicKey === cvote.vote) {

                        cvotename = ditem.username;

                    }
                }

                let modalData = (
                    <form className="was-validated">

                        <p>You must first Un-vote your current vote prior to making a new vote.</p>

                        <div className="form-group float-label position-relative active">
                            <input readonly className="form-control text-white" value={cvotename} />
                            <label className="form-control-label text-white">Voting For</label>
                        </div>
                        <div className="form-group float-label position-relative active">
                            <input required id="send_password" type="password" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                            <label className="form-control-label text-white">Password</label>
                        </div>

                    </form>
                );

                store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
                store.dispatch(updateStore({ key: 'modalData', value: null }));
                store.dispatch(updateStore({ key: 'modalButton', value: 'Unvote' }));
                store.dispatch(updateStore({ key: 'modalTitle', value: 'Unvote ' + state.walletticker + ' Delegate' }));
                store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));


            }
            else {

                let modalData = (
                    <form className="was-validated">

                        <p>Select the delegate that you wish to vote for.</p>

                        <div className="form-group float-label position-relative active">

                            <select required id="send_vote" className="form-control text-white" onChange={handleSendFormChange}>
                                <option />
                                {dList}
                            </select>

                            <label className="form-control-label text-white">Vote For</label>
                        </div>
                        <div className="form-group float-label position-relative active">
                            <input required id="send_password" type="password" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                            <label className="form-control-label text-white">Password</label>
                        </div>

                    </form>
                );

                store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
                store.dispatch(updateStore({ key: 'modalData', value: null }));
                store.dispatch(updateStore({ key: 'modalButton', value: 'Vote' }));
                store.dispatch(updateStore({ key: 'modalTitle', value: 'Vote for ' + state.walletticker + ' Delegate' }));
                store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

            }

        })();
    };

    const doPayReceive = (e) => {

        e.preventDefault();

        (async () => {

            setState({ modalType: 'request' });

            let modalData = (
                <form className="was-validated">

                    <div className="form-group float-label position-relative active">

                        <select required id="request_contact" className="form-control text-white" onChange={handleSendFormChange}>
                            <option value=''></option>
                        </select>

                        <label className="form-control-label text-white">Contact</label>
                    </div>

                    <div className="form-group float-label position-relative active">
                        <input required id="request_email" type="text" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Email</label>
                    </div>
                    <div className="form-group float-label position-relative active">
                        <input required id="request_amount" type="text" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Amount</label>
                    </div>
                    <div className="form-group float-label position-relative active">
                        <input required id="request_detail" type="text" className="form-control text-white" onChange={handleSendFormChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Notes/Details</label>
                    </div>

                </form>
            );

            store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
            store.dispatch(updateStore({ key: 'modalData', value: null }));
            store.dispatch(updateStore({ key: 'modalButton', value: 'Request' }));
            store.dispatch(updateStore({ key: 'modalTitle', value: 'Request ' + state.walletticker }));
            store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        })();
    };

    const setCurrentPage = (e, page, pagetitle = '') => {
        e.preventDefault();
        store.dispatch(updateStore({ key: 'requestedPage', value: page }));
        store.dispatch(updateStore({ key: 'pageTitle', value: pagetitle }));

        if (state.isLoggedIn === true) {

            (async () => {

                let res = await userService.get();

                if (res.status === true) {
                    store.dispatch(updateStore({ key: 'user', value: res.user }));
                }
                else {

                    store.dispatch(updateStore({ key: 'isLoggedIn', value: false }));
                    store.dispatch(updateStore({ key: 'accessToken', value: null }));
                    store.dispatch(updateStore({ key: 'requestedPage', value: 'login' }));
                    store.dispatch(updateStore({ key: 'pageTitle', value: 'Login' }));

                    toast.error('Authentication Session Has Expired');

                }

            })();

        }

    };

    const handleCreateWalletChange = event => {


        var currentWalletForm = state.walletForm || {};

        currentWalletForm[event.target.id] = event.target.value;

        setState({ walletForm: currentWalletForm });

    };

    const createWallet = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.getavailcryptocurr();

            setState({ modalType: 'createwallet' });

            let modalData = (
                <form className="was-validated">

                    <div className="form-group float-label position-relative active">

                        <select required id="create_currency" className="form-control text-white" onChange={handleCreateWalletChange}>
                            <option value=''></option>
                            {res.currencies.map((resitem, index) => (
                                <option value={resitem.ticker}>{resitem.name}</option>
                            ))}
                        </select>

                        <label className="form-control-label text-white">Select Currency</label>
                    </div>

                    <div className="form-group float-label position-relative active">
                        <input required id="create_password" type="password" className="form-control text-white" onChange={handleCreateWalletChange} autoComplete="new-password" />
                        <label className="form-control-label text-white">Your Password</label>
                    </div>

                </form>
            );

            store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
            store.dispatch(updateStore({ key: 'modalData', value: null }));
            store.dispatch(updateStore({ key: 'modalButton', value: 'Create Wallet' }));
            store.dispatch(updateStore({ key: 'modalTitle', value: 'Create New Wallet' }));
            store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        })();

    };

    const doModalCreateWallet = () => {

        //console.log('model button click');
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        var ticker = state.walletForm.create_currency || null;
        var password = state.walletForm.create_password || null;

        var error = false;

        if (ticker === null || ticker === '' || password === null || password === '') {
            error = true;
        }

        if (error === true) {

            toast.error('Form error');

        }
        else {

            (async () => {

                let res = await userService.createcryptowallet(ticker, password);

                if (res.status === true) {


                    let res2 = await userService.get();

                    store.dispatch(updateStore({ key: 'user', value: res2.user }));

                    toast.success(res.message);

                }
                else {

                    toast.error(res.message);

                }

            })();

        }

    };
*/

    const createBankAccount = (e) => {

        e.preventDefault();



    };

    const createDebitCard = (e) => {

        e.preventDefault();



    };

/*
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
*/

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
