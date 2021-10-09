import React from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
// SERVICES
import userService from '../services/userService';

const TwoFactorModule = ({ props }) => {

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

    const activateTwoFactor = (e) => {

        e.preventDefault();

        (async () => {

            let data = { pincode: state.tfaForm.tfapin, password: state.tfaForm.password };

            let res = await userService.usertwofactorsave(data);

            if (res.status === true) {

                toast.success(res.message);

                var currentTfaForm = state.tfaForm;

                currentTfaForm['twofactorstatus'] = res.twofactorstatus;
                currentTfaForm['qrcodedataurl'] = null;
                currentTfaForm['tfapin'] = '';

                setState({ tfaForm: currentTfaForm });

            }
            else {
                toast.error(res.message);

                var currentTfaForm = state.tfaForm;

                currentTfaForm['twofactorstatus'] = res.twofactorstatus;
                currentTfaForm['tfapin'] = '';

                setState({ tfaForm: currentTfaForm });

            }

        })();

    };

    const deactivateTwoFactor = (e) => {

        e.preventDefault();

        (async () => {

            let data = { pincode: state.tfaForm.tfapin };

            let res = await userService.usertwofactordisable(data);

            if (res.status === true) {

                toast.success(res.message);

                var currentTfaForm = state.tfaForm;

                currentTfaForm['twofactorstatus'] = res.twofactorstatus;
                currentTfaForm['qrcodedataurl'] = res.qrcodedataurl;
                currentTfaForm['tfapin'] = '';

                setState({ tfaForm: currentTfaForm });

            }
            else {
                toast.error(res.message);

                var currentTfaForm = state.tfaForm;

                currentTfaForm['twofactorstatus'] = res.twofactorstatus;
                currentTfaForm['tfapin'] = '';

                setState({ tfaForm: currentTfaForm });

            }

        })();

    };

    const handleTfaFormChange = event => {

        var currentTfaForm = state.tfaForm;

        currentTfaForm[event.target.id] = event.target.value;

        setState({ tfaForm: currentTfaForm });

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
            <CSSTransition in={state.appservicesItem === 'twofactor'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                <div className="card mb-4" style={state.showitem === true ? {} : { display: 'none' }}>
                    <div className="card-header">
                        <h6 className="subtitle mb-0">
                            Two Factor Authentication is {state.tfaForm.twofactorstatus === true ? 'Active' : 'Inactive'}
                        </h6>
                    </div>
                    <div className="card-body">

                        {(state.tfaForm.qrcodedataurl) ? (
                            <div>
                                <div>
                                    <img style={{ width: '150px', height: '150px' }} src={state.tfaForm.qrcodedataurl} />
                                    <br />
                                    Scan barcode with your authenticator app and enter the displayed PIN code to activate.
                                </div>

                                <div className="form-group float-label">
                                    <input type="password" className={"form-control " + (state.tfaForm.password ? 'active' : '')} autoComplete="off" id="password" onChange={handleTfaFormChange} value={state.tfaForm.password || ''} />
                                    <label className="form-control-label">Password</label>
                                </div>
                            </div>
                        ) : (<div>Enter your authenticator PIN Code to disable Two Factor</div>)}

                        <div className="form-group float-label">
                            <input type="text" className={"form-control " + (state.tfaForm.tfapin ? 'active' : '')} autoComplete="off" id="tfapin" onChange={handleTfaFormChange} value={state.tfaForm.tfapin || ''} />
                            <label className="form-control-label">Two Factor Pin</label>
                        </div>

                    </div>
                    <div className="card-footer">

                        {state.tfaForm.twofactorstatus === false ? (

                            <button className="btn btn-block btn-default rounded" onClick={e => activateTwoFactor(e)}>Activate</button>

                        ) : (

                            <button className="btn btn-block btn-danger rounded mt-3" onClick={e => deactivateTwoFactor(e)}>Deactivate</button>

                        )}

                    </div>


                </div>

            </CSSTransition>
        </section>
    );
}

export default connect(null, null)(TwoFactorModule);