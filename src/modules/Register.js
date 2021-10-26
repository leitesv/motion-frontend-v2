import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import countryList from 'react-select-country-list'
import validator from 'validator'

// import { mapStateToProps } from './mappers';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';



const RegisterModule = ({ navigation }) => {

	let history = useHistory()

	const countrylist = countryList().getData();

	const [state, setState] = React.useState({});

	const [registerForm, setRegisterForm] = React.useState({});
	const [registerFeedback, setRegisterFeedback] = React.useState({});

	const calledOnce = React.useRef(false);

	React.useEffect(() => {
		// Runs after the first render() lifecycle

		(async () => {

			let res = await userService.get();

			if (res.status !== false) {
				// redirect

				history.push('/dashboard/');

			}

		})();

    }, []);


	const handleRegisterFormChange = event => {

		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

        var currentRegisterForm = {};
            
        Object.assign(currentRegisterForm, registerForm);
        
		currentRegisterForm[event.target.id] = event.target.value;

		setRegisterForm(currentRegisterForm);
		
		

		var currentRegisterFormFeedback = {};

		Object.assign(currentRegisterFormFeedback, registerFeedback);
		
		let feedbackname = event.target.id.replace('register_', '') + 'invalid';

		currentRegisterFormFeedback[feedbackname] = null;

		setRegisterFeedback(currentRegisterFormFeedback);

	};



	const doRegister = (e) => {

		e.preventDefault();

		setRegisterFeedback({});
		
		let feedbacks = {};

		let haserrors = false;

		if (registerForm.register_password !== registerForm.register_passwordconfirm) {
			feedbacks['passwordconfirminvalid'] = 'Passwords do not match';
			haserrors = true;
		}

		if (registerForm.register_password === '' || !registerForm.register_password) {
			feedbacks['passwordinvalid'] = 'Missing password';
			haserrors = true;
		}

		if (registerForm.register_email === '' || !registerForm.register_email) {
			feedbacks['emailinvalid'] = 'Missing email';
			haserrors = true;
		}

		if (validator.isEmail(registerForm.register_email) == false) {
			feedbacks['emailinvalid'] = 'Invalid Email';
			haserrors = true;
		}
		
		if (registerForm.register_familyname === '' || !registerForm.register_familyname) {
			feedbacks['familynameinvalid'] = 'Missing family name';
			haserrors = true;
		}

		if (registerForm.register_givenname === '' || !registerForm.register_givenname) {
			feedbacks['givennameinvalid'] = 'Missing given name';
			haserrors = true;
		}

		if (registerForm.register_country === '' || !registerForm.register_country) {
			feedbacks['countryinvalid'] = 'Missing country';
			haserrors = true;
		}

		if (registerForm.register_entity === '' || !registerForm.register_entity) {
			feedbacks['entityinvalid'] = 'Missing entity';
			haserrors = true;
		}

		if (registerForm.register_entity === 'corporation') {

			if (registerForm.register_companyname === '' || !registerForm.register_companyname) {
				feedbacks['companynameinvalid'] = 'Missing company name';
				haserrors = true;
			}

		}

		if (!registerForm.register_terms || registerForm.register_terms === "false") {
			feedbacks['termsinvalid'] = 'You must agree to the terms';
			haserrors = true;
		}

		if (haserrors === true) 
		{
			setRegisterFeedback(feedbacks);
			toast.error('Error in your inputs, check for errors below');
		}

		if (haserrors === false) {

			(async () => {

				let invitecode = localStorage.getItem("invitecode");

				let data = {
					entity: registerForm.register_entity,
					email: registerForm.register_email,
					companyname: registerForm.register_companyname,
					familyname: registerForm.register_familyname,
					givenname: registerForm.register_givenname,
					residence_country: registerForm.register_country,
					password: registerForm.register_password,
					invitecode: invitecode
				};

				let res = await userService.register(data);

				if (res.status === true) {
					toast.success(res.message);
					history.push('/login/');
				}
				else {

					toast.error(res.message);

					if (res.errorfield === 'email') {
						setRegisterFeedback({emailinvalid: res.message });
					}
					else if (res.errorfield === 'password') {
						setRegisterFeedback({passwordinvalid: res.message });
					}

				}

			})();

		}

	};

	const countriesList = countrylist.length > 0
		&& countrylist.map((item, i) => {
			return (
				<option key={i} value={item.value}>{item.label}</option>
			)
		}, this);


	const feedbackShow = (item) => {

		if (registerFeedback[item] && registerFeedback[item] != '')
		{
			return (
				<div className="invalid-feedback">
					{registerFeedback[item]}
				</div>
				);				
		}
		else
		{
			return;
		}
			
	};

	const isInvalid = (item) => {
	
		if (registerFeedback[item] && registerFeedback[item] != '')
		{
			return " is-invalid";				
		}
		else if (item == 'termsinvalid' && registerForm.register_terms && registerForm.register_terms !== false)
		{
			return ' is-valid';
		}
		else if (item == 'entityinvalid' && registerForm.register_entity && registerForm.register_entity !== '')
		{
			return ' is-valid';
		}
		else if (item == 'countryinvalid' && registerForm.register_country && registerForm.register_country !== '')
		{
			return ' is-valid';
		}
		else if (item == 'emailinvalid' && registerForm.register_email && validator.isEmail(registerForm.register_email))
		{
			return ' is-valid';
		}
		else
		{
			return '';
		}
			
	};
	
	return (
		<section className="zl_login_section">
		
		
			<div className="zl_login_content container">
				<div className="zl_login_heading_text">
					<img className="mb-15" src="/assets/img/qredit-wide3.png" />
					<h3 className="zl_login_heading">Register</h3>
					<p className="zl_login_peregraph">Fill in the form below to register a new account.</p>
				</div>
				<div className="zl_login_row row">


					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Account Type</p>

							<select required id="register_entity" className={"form-control primary-color" + isInvalid('entityinvalid')} onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
								<option value=''></option>
								<option value='individual'>Personal</option>
								<option value='corporation'>Business</option>
							</select>
							{feedbackShow('entityinvalid')}		
						</div>
					</div>

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Email</p>
							<input type="text" className={"form-control primary-color" + isInvalid('emailinvalid')} id="register_email" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }} />
							{feedbackShow('emailinvalid')}		
						</div>
					</div>
					
					{registerForm.register_entity !== 'corporation' ? (

					<>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">First (Given) Name</p>
							<input type="text" className={"form-control primary-color" + isInvalid('givennameinvalid')} id="register_givenname" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('givennameinvalid')}	
						</div>
					</div>
					

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Last (Family) Name</p>
							<input type="text" className={"form-control primary-color" + isInvalid('familynameinvalid')} id="register_familyname" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('familynameinvalid')}	
						</div>
					</div>
					</>
					
					
					) : (
					
					<>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Company Name</p>
							<input type="text" className={"form-control primary-color" + isInvalid('companynameinvalid')} id="register_companyname" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('companynameinvalid')}	
						</div>
					</div>
					
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Contact First (Given) Name</p>
							<input type="text" className={"form-control primary-color" + isInvalid('givennameinvalid')} id="register_givenname" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('givennameinvalid')}	
						</div>
					</div>
					

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Contact Last (Family) Name</p>
							<input type="text" className={"form-control primary-color" + isInvalid('familynameinvalid')} id="register_familyname" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('familynameinvalid')}
						</div>
					</div>
					</>
					
					)}

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Country of Residence</p>

							<select required id="register_country" className={"form-control primary-color" + isInvalid('countryinvalid')} onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
								<option value=''></option>
								{countriesList}
							</select>
							{feedbackShow('countryinvalid')}	
						</div>
					</div>
					
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Password</p>
							<input type="password" className={"form-control primary-color" + isInvalid('passwordinvalid')} id="register_password" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('passwordinvalid')}
						</div>
					</div>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Confirm Password</p>
							<input type="password" className={"form-control primary-color" + isInvalid('passwordconfirminvalid')} id="register_passwordconfirm" onChange={handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}/>
							{feedbackShow('passwordconfirminvalid')}
						</div>
					</div>

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_contentx position-relative" style={{marginTop: '20px', marginBottom: '-20px', textAlign: 'center'}}>
						
						
							<div className="custom-control custom-checkbox mb-3">
								<input type="checkbox" className={"custom-control-input" + isInvalid('termsinvalid')} id="register_terms" onChange={handleRegisterFormChange} required />
								<label className="zl_login_input_text custom-control-label primary-color" for="register_terms">Agree to terms and conditions</label>
								{feedbackShow('termsinvalid')}
							</div>

						</div>
					</div>
									
				</div>
				<div className="zl_login_btn">
					<Link onClick={doRegister} to={'/register'} className="mx-auto">Sign Up</Link>
				</div>
			</div>

		
			<div className="">
				<div className="col-12" style={{textAlign: 'center'}}>
					<p className="primary-color">Already have an account? <Link to={'/login'} className="mx-auto">Login</Link></p>
				</div>
			</div>


		</section>
	);
}

export default connect(null, null)(RegisterModule);