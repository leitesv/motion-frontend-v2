import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav } from 'react-bootstrap';
import store from "../store/index";
import { updateStore } from "../store/updateStore";
import InfiniteScroll from "react-infinite-scroll-component";
// SERVICES
import userService from '../services/userService';



const MyAddressesModule = ({ props }) => {

    //const [state, setState] = React.useState({ user: {} });

    const [state, setState] = React.useState(store.getState());


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


    const handleAddressFormChange = event => {

        var currentAddressForm = state.addressForm;

        currentAddressForm[event.target.id] = event.target.value;

        store.dispatch(updateStore({ key: 'addressForm', value: currentAddressForm }));

    };

    const addAddress = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.addnewaddress(state.addressForm);

            if (res.status === true) {

                toast.success(res.message);
                store.dispatch(updateStore({ key: 'addressForm', value: {} }));

                setState({ initialLoad: true });

                let res = await userService.getuseraddresses();

                if (res.status === true) {

                    setState({ addresslist: res.addresslist, initialLoad: false });

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

                let res = await userService.getuseraddresses();

                if (res.status === true) {

                    setState({ addresslist: res.addresslist, initialLoad: false });

                }
                else {

                    setState({ initialLoad: false });

                }

            })();

        }
        else {

            store.dispatch(updateStore({ key: 'addressForm', value: {} }));

        }

    };

    const showAddAddress = () => {

        setState({ showAddNew: true });

    };

    const hideAddAddress = () => {

        setState({ showAddNew: false });

    };

    const setPrimary = (id) => {

        (async () => {

            let res = await userService.setprimaryaddress(id);

            if (res.status === true) {
                setState({ initialLoad: true });

                let restwo = await userService.getuseraddresses();

                if (restwo.status === true) {

                    setState({ addresslist: restwo.addresslist, initialLoad: false });

                }
                else {

                    setState({ initialLoad: false });

                }

            }

        })();

    };

    var addresslist = state.addresslist || [];

    return (
        <section className="placeholder">
            <HeadingModule name={'My Addresses'} />
            <div className="zl_SecureBackup_heading">
                <h3>My Addresses</h3>
            </div>
            <div in={state.appservicesItem === 'addresses'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                <div className="card-body pt-0 px-0 mb-4" style={state.showitem === true ? {} : { display: 'none' }}>

                    <button className="btn btn-block btn-success rounded" onClick={e => showAddAddress(e)} style={state.showAddNew === true ? { display: 'none' } : {}}>Add New Address</button>

                    {/* <div className="card-body" style={state.showAddNew === true ? {} : { display: 'none' }}>
                        <div className={"form-group float-label " + (state.addressForm.line1 ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="line1" onChange={handleAddressFormChange} value={state.addressForm.line1 || ''} />
                            <label className="form-control-label">Address Line 1</label>
                        </div>
                        <div className={"form-group float-label " + (state.addressForm.line2 ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="line2" onChange={handleAddressFormChange} value={state.addressForm.line2 || ''} />
                            <label className="form-control-label">Address Line 2</label>
                        </div>
                        <div className={"form-group float-label " + (state.addressForm.city ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="city" onChange={handleAddressFormChange} value={state.addressForm.city || ''} />
                            <label className="form-control-label">City</label>
                        </div>
                        <div className={"form-group float-label " + (state.addressForm.province ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="province" onChange={handleAddressFormChange} value={state.addressForm.province || ''} />
                            <label className="form-control-label">State/Province</label>
                        </div>
                        <div className={"form-group float-label " + (state.addressForm.postalcode ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="postalcode" onChange={handleAddressFormChange} value={state.addressForm.postalcode || ''} />
                            <label className="form-control-label">Postal Code</label>
                        </div>
                        <div className={"form-group float-label " + (state.addressForm.country ? 'active' : '')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="country" onChange={handleAddressFormChange} value={state.addressForm.country || ''} />
                            <label className="form-control-label">Country</label>
                            <button className="btn btn-block btn-default rounded" onClick={e => addAddress(e)}>Add Address</button>
                            <button className="btn btn-block btn-danger rounded" onClick={e => hideAddAddress(e)} >Cancel</button>

                        </div>
                    </div>

*/}
                    <div className="card-header pb-0">
                        <h6 className="mb-0">Your Addresses</h6>
                        <div className="hr-thin"></div>
                    </div>
                    <ul className="list-group list-group-flush">

                        <InfiniteScroll
                            dataLength={addresslist.length}
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

                            {addresslist.map((addressitem, index) => (

                                <li key={index} className="list-group-item">
                                    <div>
                                        {addressitem.line1}<br />
                                        {addressitem.line2}<br />
                                        {addressitem.city} {addressitem.province} {addressitem.postalcode}<br />
                                        {addressitem.country}&nbsp;&nbsp;&nbsp;{addressitem.isprimary === true ? (<span style={{ color: 'green' }}>Primary</span>) : (<span onClick={setPrimary(addressitem._id)}>Set Primary</span>)}
                                    </div>
                                    <div className="hr-thin"></div>
                                </li>

                            ))}

                        </InfiniteScroll>

                    </ul>

                </div>

            </div>

        </section>
    );
}

export default connect(null, null)(MyAddressesModule);


