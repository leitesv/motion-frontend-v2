import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';

import store from "../store/index";
import { updateStore } from "../store/actions/index";

// SERVICES
import userService from '../services/userService';

const LoginHelpModule = ({ props }) => {

	const [state, setState] = React.useState(store.getState());

	const [loginHelpForm, setLoginHelpForm] = React.useState({});

	let history = useHistory()

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
                history.push('/dashboard/');
            }

        })();

    }, []);

    const handleLoginHelpFormChange = event => {

        if (event.target.type === 'checkbox') {
            event.target.value = event.target.checked;
        }

        var currentLoginHelpForm = {};
            
        Object.assign(currentLoginHelpForm, loginHelpForm);
            
        currentLoginHelpForm[event.target.id] = event.target.value;

        setLoginHelpForm(currentLoginHelpForm);
        
    };

    const doPassReset = (e) => {

        var currentLoginHelpForm = {};
            
        Object.assign(currentLoginHelpForm, loginHelpForm);
        
        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setLoginHelpForm(currentLoginHelpForm);


    };

    const doTwoFactorReset = (e) => {

        var currentLoginHelpForm = {};
            
        Object.assign(currentLoginHelpForm, loginHelpForm);
        
        currentLoginHelpForm['dotwofactorreset'] = true;
        currentLoginHelpForm['dopassreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setLoginHelpForm(currentLoginHelpForm);

    };

    const doPassResetPassphrase = (e) => {

        var currentLoginHelpForm = {};
            
        Object.assign(currentLoginHelpForm, loginHelpForm);
        
        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = true;
        currentLoginHelpForm['dopassresetnopassphrase'] = false;

        setLoginHelpForm(currentLoginHelpForm);


    };

    const doPassResetNoPassphrase = (e) => {

        var currentLoginHelpForm = {};
            
        Object.assign(currentLoginHelpForm, loginHelpForm);
        
        currentLoginHelpForm['dopassreset'] = true;
        currentLoginHelpForm['dotwofactorreset'] = false;

        currentLoginHelpForm['dopassresetpassphrase'] = false;
        currentLoginHelpForm['dopassresetnopassphrase'] = true;

        setLoginHelpForm(currentLoginHelpForm);

    };

    const doSendEmailAuthCode = (e) => {


        if (loginHelpForm.login_email === ''
            || !loginHelpForm.login_email) {
            toast.error('Missing email address');
        }
        else {

            (async () => {

                let data = {
                    email: loginHelpForm.login_email
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


        if (loginHelpForm.login_password !== loginHelpForm.login_password2) {
            toast.error('Passwords do not match');
        }
        else {

            (async () => {

                let data = {
                    email: loginHelpForm.login_email,
                    word1: loginHelpForm.login_word1,
                    word2: loginHelpForm.login_word2,
                    word3: loginHelpForm.login_word3,
                    word4: loginHelpForm.login_word4,
                    word5: loginHelpForm.login_word5,
                    word6: loginHelpForm.login_word6,
                    word7: loginHelpForm.login_word7,
                    word8: loginHelpForm.login_word8,
                    word9: loginHelpForm.login_word9,
                    word10: loginHelpForm.login_word10,
                    word11: loginHelpForm.login_word11,
                    word12: loginHelpForm.login_word12,
                    password: loginHelpForm.login_password,
                    authcode: loginHelpForm.login_emailauth
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


        if (loginHelpForm.login_password !== loginHelpForm.login_password2) {
            toast.error('Passwords do not match');
        }
        else {

            (async () => {

                let data = {
                    email: loginHelpForm.login_email,
                    password: loginHelpForm.login_password,
                    authcode: loginHelpForm.login_emailauth
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


        if (!loginHelpForm.login_password || loginHelpForm.login_password === '') {
            toast.error('Missing field data');
        }
        else {

            (async () => {

                let data = {
                    email: loginHelpForm.login_email,
                    password: loginHelpForm.login_password,
                    authcode: loginHelpForm.login_emailauth,
                    word1: loginHelpForm.login_word1
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

		<section className="zl_login_section">
			<div className="zl_login_content container pb-1">

				<div className="zl_login_heading_text">
					<a href="/"><img className="mb-15" src="/assets/img/qredit-wide3.png" /></a>
					<h3 className="zl_login_heading">Login Help</h3>
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

            {loginHelpForm.dopassreset === true ? (
                <div className="container h-100 primary-color">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset Password</h3>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <strong>Due to the nature of our systems, we can ONLY reset your password in one of the following cases:</strong>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <ul>
                            <li style={{listStyleType: 'circle'}}>You know your 12 word recovery phrase.  Using your phrase we can verify that your master Qredit address is the same, and therefore re-encrypt your data with a new password.</li>
                            <li style={{listStyleType: 'circle'}}>You do not know your 12 word recovery phrase, but do not have any balances in your crypto wallets.   In this case, we will assign you a new 12 word recovery phrase corresponding to a new master Qredit address using a new password.</li>
                        </ul>
                    </div>
                    <div className="row justify-content-center mb-1">
                        If neither of those apply to your situation, then any funds in your crypto wallets will be lost as we cannot gain access to the passphrase encrypted in our systems.
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doPassResetPassphrase(e)} className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    I Know My Recovery Phrase
                                </div>
                            </li>
                            <li className="nav-item" onClick={e => doPassResetNoPassphrase(e)} className="nav-link active">
                                <div>
                                    I Do Not Know My Recovery Phrase
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}

            {loginHelpForm.dopassresetpassphrase === true ? (
                <div className="container h-100 primary-color">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset with Recovery Phrase</h3>
                    </div>
                    <div className="row justify-content-center">
                        
						<div className="zl_login_row row">

							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_email" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_email || ''} />
									<label className="form-control-label primary-color">Account Email</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_emailauth" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_emailauth || ''} />
									<label className="form-control-label primary-color">Email Authorization Code</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className="row justify-content-center">
									<ul className="nav nav-pills justify-content-center mb-4">
										<li className="nav-item" onClick={e => doSendEmailAuthCode(e)} className="nav-link active" style={{ marginRight: '5px' }}>
											<div>
												Send Auth Code
											</div>
										</li>
									</ul>

								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word1" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word1 || ''} />
									<label className="form-control-label primary-color">Word #1</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word2" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word2 || ''} />
									<label className="form-control-label primary-color">Word #2</label>
								</div>
							</div>
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word3" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word3 || ''} />
									<label className="form-control-label primary-color">Word #3</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word4" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word4 || ''} />
									<label className="form-control-label primary-color">Word #4</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word5" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word5 || ''} />
									<label className="form-control-label primary-color">Word #5</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word6" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word6 || ''} />
									<label className="form-control-label primary-color">Word #6</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word7" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word7 || ''} />
									<label className="form-control-label primary-color">Word #7</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word8" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word8 || ''} />
									<label className="form-control-label primary-color">Word #8</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word9" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word9 || ''} />
									<label className="form-control-label primary-color">Word #9</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word10" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word10 || ''} />
									<label className="form-control-label primary-color">Word #10</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word11" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word11 || ''} />
									<label className="form-control-label primary-color">Word #11</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_word12" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word12 || ''} />
									<label className="form-control-label primary-color">Word #12</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="password" id='login_password' className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_password || ''} />
									<label className="form-control-label primary-color">New Password</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="password" id='login_password2' className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_password2 || ''} />
									<label className="form-control-label primary-color">Confirm Password</label>
								</div>
							</div>
							
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendPassResetPassphrase(e)} className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    Reset Password
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}

            {loginHelpForm.dopassresetnopassphrase === true ? (
                <div className="container h-100 primary-color">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Reset Zero Balance Account</h3>
                    </div>
                    <div className="row justify-content-center">
						<div className="zl_login_row row">

							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_email" className="form-control primary-color" style={{ backgroundColor: 'transparent' }}  onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_email || ''} />
									<label className="form-control-label primary-color">Account Email</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_emailauth" className="form-control primary-color" style={{ backgroundColor: 'transparent' }}  onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_emailauth || ''} />
									<label className="form-control-label primary-color">Email Authorization Code</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
							
								<div className="row justify-content-center">
									<ul className="nav nav-pills justify-content-center mb-4">
										<li className="nav-item" onClick={e => doSendEmailAuthCode(e)} className="nav-link active" style={{ marginRight: '5px' }}>
											<div>
												<span className="material-icons icon" />Send Auth Code
											</div>
										</li>
									</ul>

								</div>
                            
                            </div>

							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="password" id='login_password' className="form-control primary-color" style={{ backgroundColor: 'transparent' }}  onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_password || ''} />
									<label className="form-control-label primary-color">New Password</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="password" id='login_password2' className="form-control primary-color" style={{ backgroundColor: 'transparent' }}  onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_password2 || ''} />
									<label className="form-control-label primary-color">Confirm Password</label>
								</div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendPassResetNoPassphrase(e)} className="nav-link active" style={{ marginRight: '5px' }}>
                                <div>
                                    Reset Password
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}


            {loginHelpForm.dotwofactorreset === true ? (
                <div className="container h-100 primary-color">
                    <div className="row justify-content-center">
                        <h3 className="font-weight-normal mb-1">Two Factor Reset</h3>
                    </div>
                    <div className="row justify-content-center">
						<div className="zl_login_row row">
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_email" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_email || ''} />
									<label className="form-control-label primary-color">Account Email</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id="login_emailauth" className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_emailauth || ''} />
									<label className="form-control-label primary-color">Email Authorization Code</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className="row justify-content-center">
									<ul className="nav nav-pills justify-content-center mb-4">
										<li className="nav-item" onClick={e => doSendEmailAuthCode(e)} className="nav-link active" style={{ marginRight: '5px' }}>
											<div>
												<span className="material-icons icon" />Send Auth Code
											</div>
										</li>
									</ul>

								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="password" id='login_password' className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_password || ''} />
									<label className="form-control-label primary-color">Current Password</label>
								</div>
							</div>
							
							<div className="zl_login_col_12 col-12">
								<div className={"zl_login_input_content position-relative"}>
									<input required type="text" id='login_word1' className="form-control primary-color" style={{ backgroundColor: 'transparent' }} onChange={handleLoginHelpFormChange} autoComplete="new-password" value={loginHelpForm.login_word1 || ''} />
									<label className="form-control-label primary-color">Word #1 of Passphrase</label>
								</div>
                        	</div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ul className="nav nav-pills justify-content-center mb-4">
                            <li className="nav-item" onClick={e => doSendTwoFactorReset(e)} className="nav-link active">
                                <div>
                                    <span className="material-icons icon" />Reset Two Factor
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>) : ''}
            </div>
        </section>
    );
}

export default connect(null, null)(LoginHelpModule);