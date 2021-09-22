import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';

// import { mapStateToProps } from './mappers';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';



const RegisterModule = ({ navigation }) => {

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

	/*var countriesList = countrylist.length > 0
		&& countrylist.map((item, i) => {
			return (
				<option key={i} value={item.value}>{item.label}</option>
			)
		}, this);*/

	return (
		<section className="zl_login_section">
			<div className="zl_login_content container">
				<div className="zl_login_heading_text">
					<h3 className="zl_login_heading">Login</h3>
					<p className="zl_login_peregraph">Enter your email, password, and two-factor pin (if enabled) to login.</p>
				</div>
				<div className="zl_login_row row">

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Email</p>
							<input type="text" className="zl_login_input" id="login_email" onChange={state.handleLoginFormChange} />
						</div>
					</div>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Password</p>
							<input type="password" className="zl_login_input" id="login_password" onChange={state.handleLoginFormChange} />
						</div>
					</div>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Two Factor PIN</p>
							<input type="text" className="zl_login_input" id="login_tfapin" onChange={state.handleLoginFormChange} />
						</div>
					</div>

				</div>
				<div className="zl_login_btn">
					<Link onClick={state.doLogin} to={'/login'} className="mx-auto">Login</Link>
				</div>
			</div>
		</section>
	);
}

export default connect(null, null)(RegisterModule);