import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

const LoginHelpModule = ({ props }) => {

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

    const handleLoginHelpFormChange = event => {

        if (event.target.type === 'checkbox') {
            event.target.value = event.target.checked;
        }

        var currentLoginHelpForm = state.loginHelpForm;

        currentLoginHelpForm[event.target.id] = event.target.value;

        setState({ loginHelpForm: currentLoginHelpForm });

    };

    const doPassReset = (e) => {

        var currentLoginHelpForm = state.loginHelpForm;

        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setState({ loginHelpForm: currentLoginHelpForm });


    };

    const doTwoFactorReset = (e) => {

        var currentLoginHelpForm = state.loginHelpForm;

        currentLoginHelpForm['dotwofactorreset'] = true;
        currentLoginHelpForm['dopassreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setState({ loginHelpForm: currentLoginHelpForm });

    };

    const doPassResetPassphrase = (e) => {

        var currentLoginHelpForm = state.loginHelpForm;

        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = true;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setState({ loginHelpForm: currentLoginHelpForm });


    };

    const doPassResetNoPassphrase = (e) => {

        var currentLoginHelpForm = state.loginHelpForm;

        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = true;

        setState({ loginHelpForm: currentLoginHelpForm });


    };

    const doSendEmailAuthCode = (e) => {


        if (state.loginHelpForm.login_email === ''
            || !state.loginHelpForm.login_email) {
            toast.error('Missing email address');
        }
        else {

            (async () => {

                let data = {
                    email: state.loginHelpForm.login_email
                };

                let res = await userService.usergetemailauth(data);

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    };

    const doSendPassResetPassphrase = (e) => {


        if (state.loginHelpForm.login_password !== state.loginHelpForm.login_password2) {
            toast.error('Passwords do not match');
        }
        else {

            (async () => {

                let data = {
                    email: state.loginHelpForm.login_email,
                    word1: state.loginHelpForm.login_word1,
                    word2: state.loginHelpForm.login_word2,
                    word3: state.loginHelpForm.login_word3,
                    word4: state.loginHelpForm.login_word4,
                    word5: state.loginHelpForm.login_word5,
                    word6: state.loginHelpForm.login_word6,
                    word7: state.loginHelpForm.login_word7,
                    word8: state.loginHelpForm.login_word8,
                    word9: state.loginHelpForm.login_word9,
                    word10: state.loginHelpForm.login_word10,
                    word11: state.loginHelpForm.login_word11,
                    word12: state.loginHelpForm.login_word12,
                    password: state.loginHelpForm.login_password,
                    authcode: state.loginHelpForm.login_emailauth
                };

                let res = await userService.userresetpasspassphrase(data);

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    };

    const doSendPassResetNoPassphrase = (e) => {


        if (state.loginHelpForm.login_password !== state.loginHelpForm.login_password2) {
            toast.error('Passwords do not match');
        }
        else {

            (async () => {

                let data = {
                    email: state.loginHelpForm.login_email,
                    password: state.loginHelpForm.login_password,
                    authcode: state.loginHelpForm.login_emailauth
                };

                let res = await userService.userresetpassnopassphrase(data);

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    };

    const doSendTwoFactorReset = (e) => {


        if (!state.loginHelpForm.login_password || state.loginHelpForm.login_password === '') {
            toast.error('Missing field data');
        }
        else {

            (async () => {

                let data = {
                    email: state.loginHelpForm.login_email,
                    password: state.loginHelpForm.login_password,
                    authcode: state.loginHelpForm.login_emailauth,
                    word1: state.loginHelpForm.login_word1
                };

                let res = await userService.userresettwofactor(data);

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    };


    return (
        <section className="placeholder">
            <HeadingModule name={'PlaceholderTitle'} />
            <div className="zl_SecureBackup_heading">
                <h3>Title</h3>
            </div>
            <div className="container h-100 text-white">
                <div className="row h-100">
                    <div className="col-12 align-self-center mb-0">
                        <div className="row justify-content-center">
                            <div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">
                                <div className="row no-gutters text-center justify-content-center mb-4">
                                    <li className="navbar-brand">
                                        <img alt='' className="center" src="./img/qredit-wide2.png" style={{ height: '30px', textAlign: 'center' }} />
                                    </li>
                                </div>
                                <center><h2 className="font-weight-normal mb-1">Login Help</h2></center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <ul className="nav nav-pills justify-content-center mb-4">
                    <li className="nav-item" onClick={e => doPassReset(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                        <div>
                            <span className="material-icons icon" />I Forgot My Password
                        </div>
                    </li>
                    <li className="nav-item" onClick={e => doTwoFactorReset(e)} href="/" className="nav-link active">
                        <div>
                            <span className="material-icons icon" />I Lost My Two Factor Device
                        </div>
                    </li>
                </ul>
            </div>

            {state.loginHelpForm.dopassreset === true ? (
                <div className="container h-100 text-white">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset Password</h3>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <strong>Due to the nature of our systems, we can ONLY reset your password in one of the following cases:</strong>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <ul>
                            <li>You know your 12 word recovery phrase.  Using your phrase we can verify that your master Qredit address is the same, and therefore re-encrypt your data with a new password.</li>
                            <li>You do not know your 12 word recovery phrase, but do not have any balances in your crypto wallets.   In this case, we will assign you a new 12 word recovery phrase corresponding to a new master Qredit address using a new password.</li>
                        </ul>
                    </div>
                    <div className="row justify-content-center mb-1">
                        If neither of those apply to your situation, then any funds in your crypto wallets will be lost as we cannot gain access to the passphrase encrypted in our systems.
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doPassResetPassphrase(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    <span className="material-icons icon" />I Know My Recovery Phrase
                                </div>
                            </li>
                            <li className="nav-item" onClick={e => doPassResetNoPassphrase(e)} href="/" className="nav-link active">
                                <div>
                                    <span className="material-icons icon" />I Do Not Know My Recovery Phrase
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}

            {state.loginHelpForm.dopassresetpassphrase === true ? (
                <div className="container h-100 text-white">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset with Recovery Phrase</h3>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_email ? 'active' : '')}>
                                <input required type="text" id="login_email" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_email || ''} />
                                <label className="form-control-label text-white">Account Email</label>
                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_emailauth ? 'active' : '')}>
                                <input required type="text" id="login_emailauth" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_emailauth || ''} />
                                <label className="form-control-label text-white">Email Authorization Code</label>
                            </div>

                            <div className="row justify-content-center">
                                <ul className="nav nav-pills justify-content-center mb-4">
                                    <li className="nav-item" onClick={e => doSendEmailAuthCode(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                        <div>
                                            <span className="material-icons icon" />Send Auth Code
                                        </div>
                                    </li>
                                </ul>

                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word1 ? 'active' : '')}>
                                <input required type="text" id="login_word1" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word1 || ''} />
                                <label className="form-control-label text-white">Word #1</label>
                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word2 ? 'active' : '')}>
                                <input required type="text" id="login_word2" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word2 || ''} />
                                <label className="form-control-label text-white">Word #2</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word3 ? 'active' : '')}>
                                <input required type="text" id="login_word3" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word3 || ''} />
                                <label className="form-control-label text-white">Word #3</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word4 ? 'active' : '')}>
                                <input required type="text" id="login_word4" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word4 || ''} />
                                <label className="form-control-label text-white">Word #4</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word5 ? 'active' : '')}>
                                <input required type="text" id="login_word5" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word5 || ''} />
                                <label className="form-control-label text-white">Word #5</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word6 ? 'active' : '')}>
                                <input required type="text" id="login_word6" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word6 || ''} />
                                <label className="form-control-label text-white">Word #6</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word7 ? 'active' : '')}>
                                <input required type="text" id="login_word7" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word7 || ''} />
                                <label className="form-control-label text-white">Word #7</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word8 ? 'active' : '')}>
                                <input required type="text" id="login_word8" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word8 || ''} />
                                <label className="form-control-label text-white">Word #8</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word9 ? 'active' : '')}>
                                <input required type="text" id="login_word9" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word9 || ''} />
                                <label className="form-control-label text-white">Word #9</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word10 ? 'active' : '')}>
                                <input required type="text" id="login_word10" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word10 || ''} />
                                <label className="form-control-label text-white">Word #10</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word11 ? 'active' : '')}>
                                <input required type="text" id="login_word11" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word11 || ''} />
                                <label className="form-control-label text-white">Word #11</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word12 ? 'active' : '')}>
                                <input required type="text" id="login_word12" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word12 || ''} />
                                <label className="form-control-label text-white">Word #12</label>
                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_password ? 'active' : '')}>
                                <input required type="password" id='login_password' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_password || ''} />
                                <label className="form-control-label text-white">New Password</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_password2 ? 'active' : '')}>
                                <input required type="password" id='login_password2' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_password2 || ''} />
                                <label className="form-control-label text-white">Confirm Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendPassResetPassphrase(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    <span className="material-icons icon" />Reset Password
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}

            {state.loginHelpForm.dopassresetnopassphrase === true ? (
                <div className="container h-100 text-white">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset Zero Balance Account</h3>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_email ? 'active' : '')}>
                                <input required type="text" id="login_email" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_email || ''} />
                                <label className="form-control-label text-white">Account Email</label>
                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_emailauth ? 'active' : '')}>
                                <input required type="text" id="login_emailauth" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_emailauth || ''} />
                                <label className="form-control-label text-white">Email Authorization Code</label>
                            </div>

                            <div className="row justify-content-center">
                                <ul className="nav nav-pills justify-content-center mb-4">
                                    <li className="nav-item" onClick={e => doSendEmailAuthCode(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                        <div>
                                            <span className="material-icons icon" />Send Auth Code
                                        </div>
                                    </li>
                                </ul>

                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_password ? 'active' : '')}>
                                <input required type="password" id='login_password' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_password || ''} />
                                <label className="form-control-label text-white">New Password</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_password2 ? 'active' : '')}>
                                <input required type="password" id='login_password2' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_password2 || ''} />
                                <label className="form-control-label text-white">Confirm Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendPassResetNoPassphrase(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    <span className="material-icons icon" />Reset Password
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}


            {state.loginHelpForm.dotwofactorreset === true ? (
                <div className="container h-100 text-white">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Two Factor Reset</h3>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_email ? 'active' : '')}>
                                <input required type="text" id="login_email" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_email || ''} />
                                <label className="form-control-label text-white">Account Email</label>
                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_emailauth ? 'active' : '')}>
                                <input required type="text" id="login_emailauth" className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_emailauth || ''} />
                                <label className="form-control-label text-white">Email Authorization Code</label>
                            </div>

                            <div className="row justify-content-center">
                                <ul className="nav nav-pills justify-content-center mb-4">
                                    <li className="nav-item" onClick={e => doSendEmailAuthCode(e)} href="/" className="nav-link active" style={{ marginRight: '5px' }}>
                                        <div>
                                            <span className="material-icons icon" />Send Auth Code
                                        </div>
                                    </li>
                                </ul>

                            </div>

                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_password ? 'active' : '')}>
                                <input required type="password" id='login_password' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_password || ''} />
                                <label className="form-control-label text-white">Current Password</label>
                            </div>
                            <div className={"form-group float-label position-relative " + (state.loginHelpForm.login_word1 ? 'active' : '')}>
                                <input required type="text" id='login_word1' className="form-control text-white" onKeyDown={state.onKeyDownLogin} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={state.loginHelpForm.login_word1 || ''} />
                                <label className="form-control-label text-white">Word #1 of Passphrase</label>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendTwoFactorReset(e)} href="/" className="nav-link active">
                                <div>
                                    <span className="material-icons icon" />Reset Two Factor
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}
        </section>
    );
}

export default connect(null, null)(LoginHelpModule);