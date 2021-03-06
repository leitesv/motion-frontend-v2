import React from "react";
import { Link } from 'react-router-dom';

class WelcomeModule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            email: '',
            username: '',
            password: '',
        }
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    _next = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep
        })
    }

    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < 3) {
            return (
                <button
                    className="zl_welcome_slide_step_btns"
                    type="button" onClick={this._next}>
                    Next
                </button>
            )
        }
        return null;
    }

    render() {
        return (
            <section className="zl_welcome_slide_section">
                <div className="zl_welcome_slide_content container">
                    <img src="assets/image/welcome-round-shap1.svg" alt="round-shap" className="round_shap_img_one" />
                    <img src="assets/image/welcome-round-shap2.svg" alt="round-shap" className="round_shap_img_two" />
                    <img src="assets/image/light-welcome-round-shap1.png" alt="round-shap" className="round_shap_light_img_one" />
                    <img src="assets/image/light-welcome-round-shap2.png" alt="round-shap" className="round_shap_light_img_two" />
                    <React.Fragment>
                        {/*render the form steps and pass required props in*/}
                        <Step1
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            email={this.state.email}
                        />
                        <Step2
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            username={this.state.username}
                        />
                        <Step3
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            password={this.state.password}
                        />
                        {/* {this.previousButton()} */}
                        <ul className="zl_welcome_slide_indicator">
                            <li className="zl_welcome_slide_indicator_items" title={this.state.currentStep}></li>
                            <li className="zl_welcome_slide_indicator_items" title={this.state.currentStep}></li>
                            <li className="zl_welcome_slide_indicator_items" title={this.state.currentStep}></li>
                        </ul>

                        {this.nextButton()}
                    </React.Fragment>
                </div>
            </section>
        );
    }
}

function Step1(props) {
    if (props.currentStep !== 1) {
        return null
    }
    return (
    	<React.Fragment>
			<div className="zl_welcome_slide_img center-center">
				<img src="assets/img/home-1.png" alt="wizard-img" className="img-fluid zl_dark_theme_slide_img welcomeimage" />
				<img src="assets/img/home-1.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img" />
				<img src="assets/img/qredit-wide3.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img mb-15" />
				<h2 className="zl_welcome_slide_heading">Digital Banking Excellence</h2>
				<p className="zl_welcome_slide_peregraph">The new and revolutionary Qredit Motion app empowers user to spend a broad range of crypto and fiat currencies with real-time conversion at point-of-sale and low exchange fees.</p>
			</div>
            <div className="row primary-color" style={{textAlign:'center', margin:'auto'}}>
                If you're ready, then&nbsp;<Link to={'/register'} className="">Signup</Link>
                &nbsp; or you can&nbsp;<Link to={'/login'} className="">Login</Link>
            </div>
		</React.Fragment>
    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    return (
    	<React.Fragment>
			<div className="zl_welcome_slide_img center-center">
				<img src="assets/img/home-2.png" alt="wizard-img" className="img-fluid zl_dark_theme_slide_img" />
				<img src="assets/img/home-2.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img" />
				<img src="assets/img/qredit-wide3.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img mb-15" />
				<h2 className="zl_welcome_slide_heading">Open Banking Standard Compliant</h2>
				<p className="zl_welcome_slide_peregraph">It opens the way to new products and services that could help customers and small to medium-sized businesses get a better deal. It could also give you a more detailed understanding of your accounts and help you find new ways to make the most of your money.</p>
			</div>
            <div className="row primary-color" style={{textAlign:'center', margin:'auto'}}>
                If you're ready, then&nbsp;<Link to={'/register'} className="">Signup</Link>
                &nbsp; or you can&nbsp;<Link to={'/login'} className="">Login</Link>
            </div>
        </React.Fragment>
    );
}

function Step3(props) {
    if (props.currentStep !== 3) {
        return null
    }
    return (
        <React.Fragment>
            <div className="zl_welcome_slide_img center-center">
                <img src="assets/img/home-3.png" alt="wizard-img" className="img-fluid zl_dark_theme_slide_img" />
                <img src="assets/img/home-3.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img" />
                <img src="assets/img/qredit-wide3.png" alt="wizard-img" className="img-fluid zl_light_theme_slide_img mb-15" />
                <h2 className="zl_welcome_slide_heading">Multi-cryptocurrency and Fiat Digital Wallet</h2>
                <p className="zl_welcome_slide_peregraph">A secure digital wallet, buy, store, exchange and earn cryptocurrency. Hardware wallets to be supported in future releases. Get started!</p>

            </div>
            <div className="row">
                <Link to={'/register'} className="zl_welcome_slide_step_btns">Signup</Link>
                <Link to={'/login'} className="zl_welcome_slide_step_btns bg-lightblue">Login</Link>
            </div>
        </React.Fragment>
    );
}
export default WelcomeModule