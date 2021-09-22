import React, { useState } from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import "react-datepicker/dist/react-datepicker.css";

import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import copy from "copy-to-clipboard";
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';

// import { mapStateToProps } from './mappers';

const NotificationSettingsModule = (props) => {

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

            setState({ shownItems: 10 });

            let res = await userService.getnotificationhistory(0, 10);

            if (res.status === true) {
                setState({ 'notificationhistory': res.notificationhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            let res = await userService.getnotificationhistory(skip, limit);

            if (res.status === true) {

                let newhistory = state.notificationhistory.concat(res.notificationhistory);

                setState({ 'notificationhistory': newhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const viewNotification = (e, id) => {

        (async () => {

            let res = await userService.getnotification(id);

            if (res.status === true) {
                console.log(res);
            }

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

    var currentsettings = state.user.notifications || {};

    return (
        <>
            <section className="zl_dashboard_page">

                <HeadingModule name={'Notifications'} />
                <div className="card">
                    <div className="card-header">
                        <h6 className="mb-0">Notifications</h6>
                    </div>
                    <div className="card-body px-0">
                        <div className="list-group list-group-flush">


                            {/*  <InfiniteScroll
                                dataLength={state.notificationhistory.length}
                                next={fetchMoreData}
                                hasMore={state.hasMore}
                                loader={
                                    <p style={{ textAlign: "center" }}>
                                        <b>Loading...</b>
                                    </p>
                                }
                                height={500}
                                endMessage={
                                    <p style={{ textAlign: "center" }}>
                                        <b>No More Records</b>
                                    </p>
                                }
                            >
                                {state.notificationhistory.map((historyitem, index) => (

                                    <a key={index} className={historyitem.isread === false ? 'list-group-item bg-default-light' : 'list-group-item'} onClick={e => viewNotification(e, historyitem._id)} href="/">
                                        <div className="row">
                                            <div className="col-auto align-self-center">
                                                <i className="material-icons text-default">{historyitem.icon}</i>
                                            </div>
                                            <div className="col pl-0">
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        <p className="mb-0">{historyitem.title}</p>
                                                    </div>
                                                    <div className="col-auto pl-0">
                                                        <p className="small text-secondary">{historyitem.created_date}</p>
                                                    </div>
                                                </div>
                                                <p className="small text-secondary">{historyitem.subtitle}</p>
                                            </div>

                                        </div>
                                    </a>

                                ))}
                            </InfiniteScroll>
			<CSSTransition in={this.state.appservicesItem === 'notifications'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card-body pt-0 px-0 mb-4" style={this.state.showitem === true ? {} : { display: 'none' }}>
					<ul className="list-group list-group-flush ml-4">
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={e => this.setNotification(e, 'newtx')} style={{ cursor: 'pointer' }}>
								<input type="radio" name="newtx" className="custom-control-input" readOnly checked={(this.state.user && currentsettings.newtx === true ? 'checked' : '')} />
								<label className="custom-control-label" htmlFor="customSwitch1">New Transactions</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={e => this.setNotification(e, 'newcontact')} style={{ cursor: 'pointer' }}>
								<input type="radio" name="newcontact" className="custom-control-input" readOnly checked={(this.state.user && currentsettings.newcontact === true ? 'checked' : '')} />
								<label className="custom-control-label" htmlFor="customSwitch2">Contact Requests</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={e => this.setNotification(e, 'refsignup')} style={{ cursor: 'pointer' }}>
								<input type="radio" name="refsignup" className="custom-control-input" readOnly checked={(this.state.user && currentsettings.refsignup === true ? 'checked' : '')} />
								<label className="custom-control-label" htmlFor="customSwitch2">Referral Signups</label>
							</div>
						</li>
					</ul>
				</div>

			</CSSTransition>
*/}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default connect(null, null)(NotificationSettingsModule);
