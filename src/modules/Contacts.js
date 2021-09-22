import React, { useState } from "react";
import { connect } from "react-redux";
import { Tab, Nav } from 'react-bootstrap';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import "react-datepicker/dist/react-datepicker.css";
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import copy from "copy-to-clipboard";
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';
import InfiniteScroll from "react-infinite-scroll-component";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
//import QRCode from "react-qr-code";

// import { mapStateToProps } from './mappers';

const ContactsModule = (props) => {

    const [state, setState] = React.useState({ user: {} });

    React.useEffect(() => {
        // Runs after the first render() lifecycle


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

    const doCopyThis = (e, crypto_balance) => {

        e.preventDefault();

        copy(crypto_balance);

        toast.success('Transaction ID Copied to Clipboard');

    };

    const refresh = () => {

        (async () => {

            setState({ isFetching: true, shownItems: 20 });

            let res = await userService.getcontacts(0, 20);

            if (res.status === true) {
                setState({ 'contactlist': res.contactlist });
                setState({ 'hasMore': res.hasmore });
            }

            setState({ isFetching: false });

        })();
    };

    const prefresh = () => {

        (async () => {

            setState({ pisFetching: true, pshownItems: 20 });

            let res = await userService.getpendingcontacts(0, 20);

            if (res.status === true) {
                setState({ 'pendingcontactlist': res.contactlist });
                setState({ 'phasMore': res.hasmore });
            }

            setState({ pisFetching: false });

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            setState({ shownItems: newCount });

            let res = await userService.getcontacts(skip, limit);

            if (res.status === true) {

                let newcontactlist = state.contactlist.concat(res.contactlist);

                setState({ 'contactlist': newcontactlist });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const pfetchMoreData = () => {

        (async () => {

            var currentCount = state.pshownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            setState({ pshownItems: newCount });

            let res = await userService.getpendingcontacts(skip, limit);

            if (res.status === true) {

                let newpcontactlist = state.pendingcontactlist.concat(res.contactlist);

                setState({ 'pendingcontactlist': newpcontactlist });
                setState({ 'phasMore': res.hasmore });
            }

        })();
    };

    const scanQR = (e) => {

        e.preventDefault();

        setState({ modalType: 'scancontactqr' });

        setState({ scanProcessing: false });

        let modalData = (
            <BarcodeScannerComponent
                width={'100%'}
                height={400}
                onUpdate={(err, result) => {
                    if (result) {

                        if (state.scanProcessing === false) {

                            setState({ scanProcessing: true });

                            (async () => {

                                let res = await userService.newcontact(result.text);

                                if (res.status === true) {

                                    toast.success(res.message);
                                    prefresh();

                                }
                                else {

                                    toast.error(res.message);

                                }

                                setState({ scanProcessing: false });

                                store.dispatch(updateStore({ key: 'modalCode', value: null }));
                                store.dispatch(updateStore({ key: 'modalData', value: null }));
                                store.dispatch(updateStore({ key: 'modalButton', value: null }));
                                store.dispatch(updateStore({ key: 'modalTitle', value: null }));
                                store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

                            })();

                        }

                    }
                }}
            />
        );

        store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
        store.dispatch(updateStore({ key: 'modalData', value: null }));
        store.dispatch(updateStore({ key: 'modalButton', value: null }));
        store.dispatch(updateStore({ key: 'modalTitle', value: 'Scan QR Contact' }));
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

    };

    const toggleFinder = (e) => {

        e.preventDefault();

        if (state.showFinder === true) {

            setState({ 'showFinder': false });

        }
        else {

            setState({ 'showFinder': true });

        }

    };

    const handleInviteFormChange = event => {

        setState({ inviteContact: event.target.value });

    };

    const inviteContact = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.createinvitation(state.inviteContact);

            if (res.status === true) {
                toast.success(res.message);
            }
            else {
                toast.error(res.message);
            }

        })();

    }

    const handleEmailFormChange = event => {

        setState({ searchEmail: event.target.value });

    };

    const findContact = (e) => {

        e.preventDefault();

        (async () => {

            var searchEmail = state.searchEmail;

            let res = await userService.findcontact(searchEmail);

            if (res.status === true) {

                setState({ foundContact: [res.foundcontact] });

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const addContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.newcontact(id);

            if (res.status === true) {

                toast.success(res.message);
                setState({ foundContact: [] });
                prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const approveContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.approvecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                prefresh();
                refresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const declineContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.declinecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const viewContact = (e, id) => {

        e.preventDefault();

        store.dispatch(updateStore({ key: 'requestedPage', value: 'viewcontact' }));
        store.dispatch(updateStore({ key: 'pageTitle', value: 'View Contact' }));
        store.dispatch(updateStore({ key: 'requestedPageExtra', value: id }));

    }

    const setCurrentItem = (e, item) => {

        e.preventDefault();

        if (state.contactsItem === item) {
            store.dispatch(updateStore({ key: 'contactsItem', value: null }));
        }
        else {
            store.dispatch(updateStore({ key: 'contactsItem', value: item }));


            if (item === 'viewpending') {

                prefresh();

            }

            if (item === 'viewcontacts') {

                refresh();

            }

        }

    };

    var contactlist = state.contactlist || [];
    var foundContact = state.foundContact || [];
    var pendingcontactlist = state.pendingContactList || [];

    return (
        <>

            <section className="zl_history_page">
                <HeadingModule name={'Contacts'} />
                <Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
                    <div className="zl_add_currency_content">
                        <h3 className="zl_bottom_content_heading">Manage your contacts</h3>
                        <Nav className="zl_add_currency_row row">
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab1" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">View Contacts</h3>
                                            <p className="cardsub">View current contacts</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab3" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">Your Contact QR</h3>
                                            <p className="cardsub">Show your Contact QR</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab4" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">Scan Contact QR</h3>
                                            <p className="cardsub">Add Contact by QR</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab5" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">Search Contacts</h3>
                                            <p className="cardsub">By Phone or Email</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab6" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">Invite</h3>
                                            <p className="cardsub">Invite new contacts</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab7" className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_price text-center cardblock">
                                        <div className="text-center">
                                            <h3 className="cardtitle fixcolor">View Pending Requests</h3>
                                            <p className="cardsub">View Pending Requests</p>
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
            </section>


            {/* old motion is below */}
            <section className="zl_dashboard_page">

                <HeadingModule name={'Contacts'} />
                <div className="row">
                    <div className="col text-center">
                        <p className="text-secondary">Manage your contacts</p>
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Contact Menu</h6>
                    </div>
                    <div className="card-body px-0 pt-0">
                        <div className="hr-thin"></div>
                        <div className="list-group list-group-flush border-color">
                            <a onClick={e => setCurrentItem(e, 'viewcontacts')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/006-user.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">View Contacts</h6><p className="text-secondary">View current contacts</p>
                                    </div>
                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(state.contactsItem === 'viewcontacts' ? {} : { display: 'none' })}>

                                <div className="input-group pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Search Contacts" />
                                    <div className="input-group-append">
                                        <button className="btn btn-default rounded" type="button" id="button-addon2">Search</button>
                                    </div>
                                </div>

                                <ul className="list-group list-group-flush">

                                    <InfiniteScroll
                                        dataLength={contactlist ? contactlist.length : 0}
                                        next={fetchMoreData}
                                        hasMore={state.hasMore || false}
                                        loader={
                                            <p style={{ textAlign: "center" }}>
                                                <b>Loading...</b>
                                            </p>
                                        }
                                        height={400}
                                        endMessage={
                                            state.isFetching === true ? (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>Loading...</b>
                                                </p>
                                            ) : (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>No More Records</b>
                                                </p>
                                            )
                                        }
                                    >
                                        {contactlist.map((contactitem, index) => (

                                            <li key={index} className="list-group-item" onClick={e => viewContact(e, contactitem._id)} style={{ cursor: 'pointer' }}>
                                                <div className="row align-items-center">
                                                    <div className="col-auto pr-0">
                                                        <div className="avatar avatar-40 rounded">
                                                            <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (state.userid === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col align-self-center pr-0">
                                                        <h6 className="font-weight-normal mb-1">{(state.userid === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(state.userid === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                        <p className="small text-secondary">{(state.userid === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                                    </div>
                                                    <div className="col-auto">
                                                        <div className="avatar avatar-40 text-default">
                                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/045-eye.svg")' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </InfiniteScroll>
                                </ul>
                            </div>

                            <a onClick={e => setCurrentItem(e, 'viewqr')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/085-link.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Your Contact QR</h6><p className="text-secondary">Show your contact QR</p>
                                    </div>
                                </div>
                            </a>
                            <div className="row align-items-center" style={(state.contactsItem === 'viewqr' ? {} : { display: 'none' })}>
                                <div className="hr-thin mb-2"></div>

                                <div className="hr-thin mt-2"></div>
                            </div>

                            <a onClick={e => scanQR(e)} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/097-qr code scan.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Scan New Contact QR</h6><p className="text-secondary">Add your contact by their QR</p>
                                    </div>
                                </div>
                            </a>
                            <a onClick={e => setCurrentItem(e, 'findcontact')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/031-search.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Search Contacts</h6><p className="text-secondary">Find by phone or email</p>
                                    </div>

                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(state.contactsItem === 'findcontact' ? {} : { display: 'none' })}>
                                <div className="hr-thin mt-2 mb-2"></div>
                                <div className="input-group col-auto pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Email/Phone" onChange={handleEmailFormChange} />
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default input-group-append">
                                            <figure className="m-0 background icon icon-30 mb-2" type="button" id="button-addon2" onClick={e => findContact(e)} style={{ backgroundImage: 'url("./img/icons/essential/svg/031-search.svg")' }} />
                                        </div>
                                    </div>
                                </div>

                                <ul className="list-group list-group-flush">

                                    {foundContact.map((contactitem, index) => (

                                        <li key={index} className="list-group-item">
                                            <div className="row align-items-center">
                                                <div className="col-auto pr-0">
                                                    <div className="avatar avatar-40 rounded">
                                                        <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + contactitem._id + ')' }}>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col align-self-center pr-0">
                                                    <h6 className="font-weight-normal mb-1">{contactitem.givenname} {contactitem.familyname}</h6>
                                                    <p className="small text-secondary">{contactitem.email}</p>
                                                </div>
                                                <div className="col-auto">
                                                    <figure onClick={e => addContact(e, contactitem._id)} className="m-0 background icon icon-30 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/009-plus.svg")' }} />
                                                </div>
                                            </div>
                                        </li>

                                    ))}
                                </ul>
                                <div className="hr-thin mt-2 mb-2"></div>
                            </div>
                            <a onClick={e => setCurrentItem(e, 'invitecontact')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/019-chat.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Invite</h6><p className="text-secondary">Invite new contacts</p>
                                    </div>
                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(state.contactsItem === 'invitecontact' ? {} : { display: 'none' })}>
                                <div className="hr-thin mt-2 mb-2"></div>
                                <div className="input-group col-auto pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Email/Phone" onChange={handleInviteFormChange} />
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default input-group-append">
                                            <figure className="m-0 background icon icon-30 mb-2" type="button" id="button-addon2" onClick={e => inviteContact(e)} style={{ backgroundImage: 'url("./img/icons/essential/svg/030-send.svg")' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="hr-thin mt-2 mb-2"></div>
                            </div>
                            <Link to={'/referralprogram'} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/073-gift.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Referral Program</h6><p className="text-secondary">Referral program</p>
                                    </div>
                                </div>
                            </Link>
                            <a onClick={e => setCurrentItem(e, 'viewpending')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("./img/icons/essential/svg/071-open mail.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">View Pending Requests</h6><p className="text-secondary">View pending contacts</p>
                                    </div>
                                </div>
                            </a>


                            <div className="card-body px-0 pt-0" style={(state.contactsItem === 'viewpending' ? {} : { display: 'none' })}>

                                <ul className="list-group list-group-flush">

                                    <InfiniteScroll
                                        dataLength={pendingcontactlist.length}
                                        next={pfetchMoreData}
                                        hasMore={state.phasMore || false}
                                        loader={
                                            <p style={{ textAlign: "center" }}>
                                                <b>Loading...</b>
                                            </p>
                                        }
                                        height={200}
                                        endMessage={
                                            state.pisFetching === true ? (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>Loading...</b>
                                                </p>
                                            ) : (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>No More Records</b>
                                                </p>
                                            )
                                        }
                                    >
                                        <div className="hr-thin"></div>
                                        {pendingcontactlist.map((contactitem, index) => (

                                            <li key={index} className="list-group-item">
                                                <div className="row align-items-center">
                                                    <div className="col-auto pr-0">
                                                        <div className="avatar avatar-40 rounded">
                                                            <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (state.userid === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col align-self-center pr-0">
                                                        <h6 className="font-weight-normal mb-1">{(state.userid === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(state.userid === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                        <p className="small text-secondary">{(state.userid === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                                    </div>
                                                    <div className="col-auto mt-2 mb-2">
                                                        {(state.userid === contactitem.userid_b._id ? <><button onClick={e => approveContact(e, contactitem._id)} className="btn btn-sm btn-success rounded mr-1" type="button" id="button-addon2">Approve</button><button onClick={e => declineContact(e, contactitem._id)} className="btn btn-sm btn-danger rounded" type="button" id="button-addon2">Decline</button></> : 'Pending')}
                                                    </div>
                                                    <div className="hr-thin"></div>
                                                </div>
                                            </li>

                                        ))}
                                    </InfiniteScroll>
                                </ul>
                            </div>



                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default connect(null, null)(ContactsModule);
