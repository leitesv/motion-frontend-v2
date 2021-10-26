import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';

const SecurityModule = ({ props }) => {

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
    const updatePassword = (e) => {

        e.preventDefault();

        if (state.passForm.new_password !== state.passForm.confirm_password) {

            toast.error("Error:  New passwords do not match");

        }
        else {

            setState({ passForm: {} });

            (async () => {

                let data = {
                    password: state.passForm.current_password,
                    newpass: state.passForm.new_password
                };

                let res = await userService.changepassword(data);

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    };

    const logoutAllDevices = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.invalidatesessions();

            if (res.status === true) {

                localStorage.removeItem("accessToken");
                store.dispatch(updateStore({ key: 'showMenu', value: false }));
                store.dispatch(updateStore({ key: 'isLoggedIn', value: false }));
                store.dispatch(updateStore({ key: 'accessToken', value: null }));
                store.dispatch(updateStore({ key: 'requestedPage', value: 'login' }));

                toast.success(res.message);

            }
            else {
                toast.error(res.message);
            }

        })();
    };

    const handlePassFormChange = event => {

        var currentPassForm = state.passForm;

        currentPassForm[event.target.id] = event.target.value;

        setState({ passForm: currentPassForm });

    };

    const setShowItem = (show) => {

        setState({ showitem: show });

    };
    return (
        <section className="placeholder">
            <HeadingModule name={'PlaceholderTitle'} />
            <div className="zl_SecureBackup_heading">
                <h3>Title</h3>
            </div>
            <CSSTransition in={state.appservicesItem === 'security'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                <div className="card mb-4" style={state.showitem === true ? {} : { display: 'none' }}>
                    <div className="card-header">
                        <h6 className="subtitle mb-0">
                            Change Password
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (state.passForm.current_password ? 'active' : '')} autoComplete="new-password" id="current_password" onChange={handlePassFormChange} value={state.passForm.current_password || ''} />
                            <label className="form-control-label">Current Password</label>
                        </div>
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (state.passForm.current_password ? 'active' : '')} autoComplete="new-password" id="new_password" onChange={handlePassFormChange} value={state.passForm.new_password || ''} />
                            <label className="form-control-label">New Password</label>
                        </div>
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (state.passForm.current_password ? 'active' : '')} autoComplete="new-password" id="confirm_password" onChange={handlePassFormChange} value={state.passForm.confirm_password || ''} />
                            <label className="form-control-label">Confirm New Password</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-block btn-default rounded" onClick={e => updatePassword(e)}>Update Password</button>
                        <p className="text-center text-secondary">Changing password requires decryption and re-encryption of your BIP39 passphrase.  Please ensure you have stored your passphrase in a secure location prior to this action.</p>

                        <button className="btn btn-block btn-danger rounded mt-3" onClick={e => logoutAllDevices(e)}>Logout from all devices</button>
                        <p className="text-center text-secondary mb-3">X devices and Apps runing on this account. We suggest to logout
                            from any other devices to avoid unrevokable situations.</p>

                    </div>


                </div>

            </CSSTransition>
        </section>
    );
}

export default connect(null, null)(SecurityModule);