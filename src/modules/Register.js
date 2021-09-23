import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import countryList from 'react-select-country-list'
// import { mapStateToProps } from './mappers';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';



const RegisterModule = ({ navigation }) => {
	const countrylist = countryList().getData();
	let history = useHistory()

	const [state, setState] = React.useState({
		loginForm: {}
	});

	const calledOnce = React.useRef(false);

	React.useEffect(() => {
		// Runs after the first render() lifecycle

		if (!calledOnce.current) {

			(async () => {

				let res = await userService.get();

				console.log(res);

				if (res.status !== false) {
					// redirect

					history.push('/dashboard/');

				}

			})();

			calledOnce.current = true;

		}

	});


	const handleRegisterFormChange = event => {

		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

		var currentRegisterForm = state.registerForm;

		currentRegisterForm[event.target.id] = event.target.value;

		setState({ registerForm: currentRegisterForm });


		var currentRegisterFormFeedback = state.registerFormFeedback;

		let feedbackname = event.target.id.replace('register_', '') + 'invalid';

		currentRegisterFormFeedback[feedbackname] = null;

		setState({ registerFormFeedback: currentRegisterFormFeedback });

	};



	const doRegister = (e) => {

		e.preventDefault();

		setState({ registerFormFeedback: {} });

		let feedbacks = {};

		let haserrors = false;

		if (state.registerForm.register_password !== state.registerForm.register_passwordconfirm) {
			feedbacks['passwordconfirminvalid'] = 'Passwords do not match';
			haserrors = true;
		}

		if (state.registerForm.register_password === '' || !state.registerForm.register_password) {
			feedbacks['passwordinvalid'] = 'Missing password';
			haserrors = true;
		}

		if (state.registerForm.register_email === '' || !state.registerForm.register_email) {
			feedbacks['emailinvalid'] = 'Missing email';
			haserrors = true;
		}

		if (state.registerForm.register_familyname === '' || !state.registerForm.register_familyname) {
			feedbacks['familynameinvalid'] = 'Missing family name';
			haserrors = true;
		}

		if (state.registerForm.register_givenname === '' || !state.registerForm.register_givenname) {
			feedbacks['givennameinvalid'] = 'Missing given name';
			haserrors = true;
		}

		if (state.registerForm.register_country === '' || !state.registerForm.register_country) {
			feedbacks['countryinvalid'] = 'Missing country';
			haserrors = true;
		}

		if (state.registerForm.register_entity === '' || !state.registerForm.register_entity) {
			feedbacks['entityinvalid'] = 'Missing entity';
			haserrors = true;
		}

		if (state.registerForm.register_entity === 'corporation') {

			if (state.registerForm.register_companyname === '' || !state.registerForm.register_companyname) {
				feedbacks['companynameinvalid'] = 'Missing company name';
				haserrors = true;
			}

		}

		if (!state.registerForm.register_terms || state.registerForm.register_terms === "false") {
			feedbacks['termsinvalid'] = 'You must agree to the terms';
			haserrors = true;
		}

		if (haserrors === true) {
			setState({ registerFormFeedback: feedbacks });
			toast.error('Error in your inputs, check for errors below');
		}

		if (haserrors === false) {

			(async () => {

				let invitecode = localStorage.getItem("invitecode");

				let data = {
					entity: state.registerForm.register_entity,
					email: state.registerForm.register_email,
					companyname: state.registerForm.register_companyname,
					familyname: state.registerForm.register_familyname,
					givenname: state.registerForm.register_givenname,
					residence_country: state.registerForm.register_country,
					password: state.registerForm.register_password,
					invitecode: invitecode
				};

				let res = await userService.register(data);

				if (res.status === true) {
					store.dispatch(updateStore({ key: 'registerForm', value: {} }));
					store.dispatch(updateStore({ key: 'requestedPage', value: 'login' }));

					toast.success(res.message);
				}
				else {

					toast.error(res.message);

					if (res.errorfield === 'email') {
						setState({ registerFormFeedback: { emailinvalid: res.message } });

					}
					else if (res.errorfield === 'password') {
						setState({ registerFormFeedback: { passwordinvalid: res.message } });
					}

				}

			})();

		}

	};

	var countriesList = countrylist.length > 0
		&& countrylist.map((item, i) => {
			return (
				<option key={i} value={item.value}>{item.label}</option>
			)
		}, this);



	return (
		<section className="zl_login_section">
			<div className="container h-100 text-white">
				<div className="row h-100">
					<div className="col-12 align-self-center mb-4">
						<div className="row justify-content-center">
							<div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">

								<div className="row no-gutters text-center justify-content-center mb-4">
									<li className="navbar-brand">
										<img alt='' className="center" src="/img/qredit-wide2.png" style={{ height: '30px', textAlign: 'center' }} />
									</li>
								</div>

								<h2 className="font-weight-normal mb-5">Register New Account</h2>
								{/*<form className="was-validated">

									 <div className={"form-group float-label position-relative " + (state.registerForm.register_entity ? 'active' : '')}>

										<select defaultValue={state.registerForm.register_entity} required id="register_entity" className="form-control text-white" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
											<option value=''></option>
											<option value='individual'>Personal</option>
											<option value='corporation'>Business</option>
										</select>

										<label className="form-control-label text-white">Account Type</label>
										<div id="register_entity_feedback" className="invalid-feedback" style={!state.registerFormFeedback.entityinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.entityinvalid || ''}</div>
									</div>

									<div className={"form-group float-label position-relative " + (state.registerForm.register_email ? 'active' : '')}>
										<input required id="register_email" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_email || ''} />
										<label className="form-control-label text-white">Email</label>
										<div id="register_email_feedback" className="invalid-feedback" style={!state.registerFormFeedback.emailinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.emailinvalid || ''}</div>
									</div>

									{state.registerForm.register_entity !== 'corporation' ? (
										<>
											<div className={"form-group float-label position-relative " + (state.registerForm.register_givenname ? 'active' : '')}>
												<input required id="register_givenname" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_givenname || ''} />
												<label className="form-control-label text-white">First (Given) Name</label>
												<div id="register_givenname_feedback" className="invalid-feedback" style={!state.registerFormFeedback.givennameinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.givennameinvalid || ''}</div>
											</div>
											<div className={"form-group float-label position-relative " + (state.registerForm.register_familyname ? 'active' : '')}>
												<input required id="register_familyname" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_familyname || ''} />
												<label className="form-control-label text-white">Last (Family) Name</label>
												<div id="register_familyname_feedback" className="invalid-feedback" style={!state.registerFormFeedback.familynameinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.familynameinvalid || ''}</div>
											</div>
										</>
									) : (
										<>
											<div className={"form-group float-label position-relative " + (state.registerForm.register_companyname ? 'active' : '')}>
												<input required id="register_companyname" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_companyname || ''} />
												<label className="form-control-label text-white">Company Name</label>
												<div id="register_companyname_feedback" className="invalid-feedback" style={!state.registerFormFeedback.companynameinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.companynameinvalid || ''}</div>
											</div>
											<div className={"form-group float-label position-relative " + (state.registerForm.register_givenname ? 'active' : '')}>
												<input required id="register_givenname" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_givenname || ''} />
												<label className="form-control-label text-white">Contact First (Given) Name</label>
												<div id="register_givenname_feedback" className="invalid-feedback" style={!state.registerFormFeedback.givennameinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.givennameinvalid || ''}</div>
											</div>
											<div className={"form-group float-label position-relative " + (state.registerForm.register_familyname ? 'active' : '')}>
												<input required id="register_familyname" type="text" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_familyname || ''} />
												<label className="form-control-label text-white">Contact Last (Family) Name</label>
												<div id="register_familyname_feedback" className="invalid-feedback" style={!state.registerFormFeedback.familynameinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.familynameinvalid || ''}</div>
											</div>
										</>
									)}

									
									<div className={"form-group float-label position-relative " + (state.registerForm.register_country ? 'active' : '')}>

										<select defaultValue={state.registerForm.register_country} required id="register_country" className="form-control text-white" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
											<option value=''></option>
											{countriesList}
										</select>

										<label className="form-control-label text-white">Country of Residence</label>
										<div id="register_country_feedback" className="invalid-feedback" style={!state.registerFormFeedback.countryinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.countryinvalid || ''}</div>
									</div>
									<div className={"form-group float-label position-relative " + (state.registerForm.register_password ? 'active' : '')}>
										<input required id="register_password" type="password" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_password || ''} />
										<label className="form-control-label text-white">Password</label>
										<div id="register_password_feedback" className="invalid-feedback" style={!state.registerFormFeedback.passwordinvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.passwordinvalid || ''}</div>
									</div>
									<div className={"form-group float-label position-relative " + (state.registerForm.register_passwordconfirm ? 'active' : '')}>
										<input required id="register_passwordconfirm" type="password" className="form-control text-white" onChange={handleRegisterFormChange} autoComplete="new-password" value={state.registerForm.register_passwordconfirm || ''} />
										<label className="form-control-label text-white">Confirm Password</label>
										<div id="register_passwordconfirm_feedback" className="invalid-feedback" style={!state.registerFormFeedback.passwordconfirminvalid ? {} : { marginBottom: '-18px' }}>{state.registerFormFeedback.passwordconfirminvalid || ''}</div>
									</div>
									<div className="form-group float-label position-relative">
										<div className="custom-control custom-switch">
											<input checked={state.registerForm.register_terms === "true"} required id="register_terms" type="checkbox" className="custom-control-input" onChange={handleRegisterFormChange} />
											<label className="custom-control-label" htmlFor="register_terms">Agree to terms and conditions</label>
											<div id="register_terms_feedback" className="invalid-feedback" >{state.registerFormFeedback.termsinvalid || ''}</div>
										</div>
									</div>
									
								</form>
								*/}
							</div>
						</div>
					</div>

				</div>
			</div>
			<div className="row justify-content-center">
				<div className="col-6">
					<li onClick={e => doRegister(e)} className="btn btn-default rounded btn-block lilink">Sign up</li>
				</div>
			</div>
		</section>
	);
}

export default connect(null, null)(RegisterModule);