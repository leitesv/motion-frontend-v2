import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';

import store from "../store/index";
import { updateStore } from "../store/actions/index";

// import { mapStateToProps } from './mappers';

// SERVICES
import userService from '../services/userService';



const LogInModule = ({ navigation }) => {

	let history = useHistory()

	//const [state,setState] = React.useState({
	//	loginForm:{}
	//});

	const [state, setState] = React.useState(store.getState());

	const calledOnce = React.useRef(false);

	React.useEffect(() => {
		// Runs after the first render() lifecycle

		if (!calledOnce.current) {

			(async () => {

				let res = await userService.get();

				if (res.status !== false) {
					// redirect

					history.push('/dashboard/');

				}

			})();

			calledOnce.current = true;

		}

	});


	const handleLoginFormChange = (event) => {

		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

		var currentLoginForm = state.loginForm;

		currentLoginForm[event.target.id] = event.target.value;

		setState({ loginForm: currentLoginForm });

	};

	const doLogin = () => {
		//setState(prev => ++prev)

		(async () => {

			let data = {
				email: state.loginForm.login_email,
				password: state.loginForm.login_password,
				tfapin: state.loginForm.login_tfapin
			};

			let res = await userService.login(data);

			if (res.status === true) {

				if (res.accessToken) {

					localStorage.setItem("accessToken", res.accessToken);
					toast.success(res.message);

					let res2 = await userService.get();

					if (res2.status === true) {
						store.dispatch(updateStore({ key: 'user', value: res2.user }));
						setState(store.getState());
					}

					history.push('/dashboard/');

				}

			}
			else {

				// 
				toast.error(res.message);

			}


		})();

	};


	return (
		<section className="zl_login_section">
			<div className="zl_login_content container">
				<div className="zl_login_heading_text">
					<img className="mb-15" src="/assets/img/qredit-wide3.png" />
					<h3 className="zl_login_heading">Login</h3>
					<p className="zl_login_peregraph">Enter your email, password, and two-factor pin (if enabled) to login.</p>
				</div>
				<div className="zl_login_row row">

					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Email</p>
							<input type="text" className="form-control primary-color" id="login_email" onChange={handleLoginFormChange} style={{ backgroundColor: 'transparent' }} />
						</div>
					</div>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Password</p>
							<input type="password" className="form-control primary-color" id="login_password" onChange={handleLoginFormChange} style={{ backgroundColor: 'transparent' }} />
						</div>
					</div>
					<div className="zl_login_col_12 col-12">
						<div className="zl_login_input_content position-relative">
							<p className="zl_login_input_text">Two Factor PIN</p>
							<input type="text" className="form-control primary-color" id="login_tfapin" onChange={handleLoginFormChange} style={{ backgroundColor: 'transparent' }} />
						</div>
					</div>

				</div>
				<div className="zl_login_btn">
					<Link onClick={doLogin} to={'/login'} className="mx-auto">Login</Link>
				</div>
			</div>
			
			<div className="">
				<div className="col-12" style={{textAlign: 'center'}}>
					<p className="primary-color">Don't have an account? <Link to={'/register'} className="mx-auto">Register Now</Link></p>
				</div>
			</div>
			
		</section>
	);
}

export default connect(null, null)(LogInModule);