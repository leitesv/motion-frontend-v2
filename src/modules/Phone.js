import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
import InfiniteScroll from "react-infinite-scroll-component";
// SERVICES
import userService from '../services/userService';

const PhoneModule = ({ props }) => {

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
    const handlePhoneFormChange = event => {

        store.dispatch(updateStore({ key: 'phoneForm', value: event.target.value }));

    };

    const handlePinFormChange = event => {

        store.dispatch(updateStore({ key: 'pinForm', value: event.target.value }));

    };

    const getPinCode = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.getpincode(state.phoneForm);

            if (res.status === true) {

                toast.success(res.message);
                store.dispatch(updateStore({ key: 'phoneForm', value: res.phone }));

            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const submitPinCode = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.submitpincode(state.phoneForm, state.pinForm);

            if (res.status === true) {
                toast.success(res.message);
                store.dispatch(updateStore({ key: 'phoneForm', value: null }));
                store.dispatch(updateStore({ key: 'pinForm', value: null }));

                setState({ initialLoad: true });

                let res = await userService.getuserphones();

                if (res.status === true) {

                    setState({ phonelist: res.phonelist, initialLoad: false });

                }
                else {

                    setState({ initialLoad: false });

                }

            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const setShowItem = (show) => {

        setState({ showitem: show });

        if (show === true) {

            (async () => {

                setState({ initialLoad: true });

                let res = await userService.getuserphones();

                if (res.status === true) {

                    setState({ phonelist: res.phonelist, initialLoad: false });

                }
                else {

                    setState({ initialLoad: false });

                }

            })();

        }
        else {

            store.dispatch(updateStore({ key: 'phoneForm', value: null }));
            store.dispatch(updateStore({ key: 'pinForm', value: null }));

        }

    };

    const setPrimary = (id) => {

        (async () => {

            let res = await userService.setprimaryphone(id);

            if (res.status === true) {
                setState({ initialLoad: true });

                let restwo = await userService.getuserphones();

                if (restwo.status === true) {

                    setState({ phonelist: restwo.phonelist, initialLoad: false });

                }
                else {

                    setState({ initialLoad: false });

                }

            }

        })();

    };

    const showAddPhone = () => {

        setState({ showAddNew: true });

    };

    const hideAddPhone = () => {

        setState({ showAddNew: false });

    };

    const phonelist = state.phonelist || [];

    return (
        <section className="placeholder">
            <HeadingModule name={'PlaceholderTitle'} />
            <div className="zl_SecureBackup_heading">
                <h3>Title</h3>
            </div>
            <CSSTransition in={state.appservicesItem === 'phones'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                <div className="card-body pt-0 px-0 mb-4" style={state.showitem === true ? {} : { display: 'none' }}>

                    <button className="btn btn-block btn-success rounded" onClick={e => showAddPhone(e)} style={state.showAddNew === true ? { display: 'none' } : {}}>Add New Phone</button>


                    <div className="card-body" style={state.showAddNew === true ? {} : { display: 'none' }}>
                        <div className={"form-group float-label " + (state.phoneForm ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="phone" onChange={handlePhoneFormChange} value={state.phoneForm || ''} />
                            <label className="form-control-label">Add Phone</label>
                            <button className="btn btn-block btn-default rounded" disabled={!state.phoneForm} onClick={e => getPinCode(e)}>Get Pin Code</button>
                        </div>
                        <div className={"form-group float-label " + (state.pinForm ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="pin" onChange={handlePinFormChange} value={state.pinForm || ''} />
                            <label className="form-control-label">Enter Pin</label>
                            <button className="btn btn-block btn-default rounded" disabled={!state.pinForm} onClick={e => submitPinCode(e)}>Submit Pin Code</button>
                            <button className="btn btn-block btn-danger rounded" onClick={e => hideAddPhone(e)} >Cancel</button>
                        </div>
                    </div>


                    <div className="card-header pb-0">
                        <h6 className="mb-0">Your Phones</h6>
                        <div className="hr-thin"></div>
                    </div>
                    <ul className="list-group list-group-flush">

                        <InfiniteScroll
                            dataLength={phonelist.length}
                            hasMore={false}
                            loader={
                                <p style={{ textAlign: "center" }}>
                                    <b>Loading...</b>
                                </p>
                            }
                            endMessage={
                                state.initialLoad === true ? (
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

                            {phonelist.map((phoneitem, index) => (

                                <li className="list-group-item">
                                    <div key={index}>
                                        {phoneitem.phone} ({phoneitem.country}) - <span style={{ color: 'green' }}>Verified</span> {phoneitem.isprimary === true ? (<span style={{ color: 'green' }}>Primary</span>) : (<span onClick={setPrimary(phoneitem._id)}>Set Primary</span>)}
                                    </div>

                                    <div className="hr-thin"></div>
                                </li>

                            ))}

                        </InfiniteScroll>

                    </ul>

                </div>

            </CSSTransition>
        </section>
    );
}

export default connect(null, null)(PhoneModule);