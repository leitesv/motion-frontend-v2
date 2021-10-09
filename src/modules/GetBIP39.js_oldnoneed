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


const GetBIP39Module = ({ props }) => {

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

    const doModalYes = () => {

        //console.log('model button click');
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

        (async () => {

            let res = await userService.bip39recorded();

            if (res.status === true) {
                store.dispatch(updateStore({ key: 'user', value: res.user }));
            }

        })();

    };

    const setLanguage = (e, language) => {

        e.preventDefault();

        let cuser = state.user;
        cuser.preferred_language = language;
        store.dispatch(updateStore({ key: 'user', value: cuser }));

        (async () => {

            let res = await userService.setlanguage(language);

            if (res.status === true) {

                toast.success('Language Setting Updated');
                store.dispatch(updateStore({ key: 'user', value: res.user }));

            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const setShowItem = (show) => {

        setState({ showitem: show });

    };

    const handlePassFormChange = event => {

        store.dispatch(updateStore({ key: 'password', value: event.target.value }));

    };

    const doGetPassphrase = (e) => {

        e.preventDefault();

        (async () => {

            if (state.password) {
                let res = await userService.getpassphrase({ password: state.password });

                if (res.status === true) {

                    let passphrase = res.message;

                    let phrasearray = passphrase.split(' ');

                    if (phrasearray.length === 12) {

                        setState({ modalType: 'bip39' });

                        let modaldata = '';

                        for (let i = 0; i < phrasearray.length; i++) {
                            modaldata += "<h5>Word #" + (i + 1) + ":  <strong>" + phrasearray[i] + "</strong></h5>";
                        }

                        store.dispatch(updateStore({ key: 'modalData', value: modaldata }));
                        store.dispatch(updateStore({ key: 'modalButton', value: 'I Have Written Down' }));
                        store.dispatch(updateStore({ key: 'modalTitle', value: 'Your BIP39 Passphrase' }));
                        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

                        store.dispatch(updateStore({ key: 'password', value: null }));

                    }
                    else {

                        toast.error('Error Decrypting Passphrase.  Check Password');

                    }

                }
                else {

                    toast.error(res.message);

                }
            }

        })();

    };

    return (/*
        <>
            <section className="zl_restore_wallet_page">
                <HeadingModule name={'Swap your old XQR'} />
                <div className="zl_restore_wallet_input_content">
                    <div className="zl_securebackup_row row">
                        {inputField.map((inputValue, i) => (
                            <div className="zl_securebackup_col_3 col-lg-3 col-md-6">
                                <div className="zl_securebackup_input_content position-relative">
                                    <p className="zl_securebackup_input_text">{inputValue}</p>
                                    <input type="text" className="zl_securebackup_input" name={`input${inputValue}`} placeholder="________" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="zl_securebackup_btn">
                        <Link to={'#'} className="mx-auto">Swap</Link>
                    </div>
                </div>
            </section>
        </>
    */
        <section>
            <div in={state.appservicesItem === 'bip'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                <div className="card text-left mt-2" style={state.showitem === true ? {} : { display: 'none' }}>
                    <div className="card-header">
                        <h6 className="subtitle mb-0">
                            Unlock and View BIP39 Passphrase
                        </h6>
                    </div>
                    <div className="card-body ">
                        By design, Qredit Motion <strong>DOES NOT</strong> have access to your ecrypted private keys stored on our system.  All keys are strongly encrypted using your login password.  We only store a Bcrypt hash of your password, which means we can not decrypt your keys without you providing the decryption password.  If you lose your login credentials, the <strong>ONLY</strong> way to restore access to your account is using your BIP39 passphrase.  Therefore, you should <strong>WRITE DOWN AND SAFELY STORE</strong> your passphrase before doing any activity on Qredit Motion.
                        <br /><br />

                        <div className="input-group mb-3">
                            <input onChange={handlePassFormChange} type="password" autoComplete="new-password" className="form-control" placeholder="Password" aria-label="Password" value={state.password || ''} />
                            <div className="input-group-append">
                                <button onClick={e => doGetPassphrase(e)} className="btn btn-outline-secondary" type="button">Get Phrase</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>);
}

export default connect(null, null)(GetBIP39Module);
