import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import copy from "copy-to-clipboard";
// SERVICES
import userService from '../services/userService';


const SwapOldXQRModule = ({ props }) => {

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

    const refresh = () => {

        (async () => {

            setState({ shownItems: 10 });

            let res = await userService.getswaptransactions(0, 10);

            if (res.status === true) {
                setState({ 'transactionlist': res.transactionlist });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems || 10;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            let res = await userService.getswaptransactions(skip, limit);

            if (res.status === true) {

                let newhistory = state.transactionlist.concat(res.transactionlist);

                setState({ 'transactionlist': newhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const handleSwapFormChange = event => {

        setState({ swapform: event.target.value });

    };

    const doSwap = (e) => {

        e.preventDefault();

        var haserrors = false;

        if (!state.swapform || state.swapform === "") {
            haserrors = true;
        }

        if (haserrors === true) {
            toast.error('Error in your inputs, check for errors below');
        }

        if (haserrors === false) {

            setState({ swapform: null, buttondisable: true });

            (async () => {

                let res = await userService.doqreditswap(state.swapform);

                setState({ buttondisable: null });

                if (res.status === true) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            })();

        }

    }

    const doCopyTxid = (e, txid) => {

        e.preventDefault();

        copy(txid);

        toast.success('Transaction ID Copied to Clipboard');

    };

    const transactionlist = state.transactionlist || [];

    return (
        <section className="zl_securebackup_page">

            <div className="main-container">
                <div className="container mt-4 text-center">

                    <li className="navbar-brand mt-4">
                        <img alt='' src="./img/qredit-wide2.png" style={{ height: '30px', marginLeft: '-15px', marginTop: '-5px' }} />
                    </li>
                    <p className="justify-content-center mt-4" style={{ color: '#d22d3d' }}><strong>Qredit Autoswap</strong></p>

                </div>

                <div className="container mt-4">
                    <h6 className="text-secondary mb-1">Convert your old XQR to new XQR coins</h6><br />
                    <h5>1. About Old XQR</h5>
                    <li>Qredit is a blockchain with it's own native XQR coins.</li>
                    <li>If you are an "old" XQR user with coins on the old blockchain with wallet addresses starting with a Q.</li>
                    <li>You can use this import function to swap your old XQR to your new wallet address starting with an X.</li>
                </div>
                <div className="container mt-4">
                    <h5>2. Swap Ratio</h5>
                    <li>The swap ratio is 10:1.</li>
                    <li>If you send 1000 XQR "from the old chain", you will receive 100 XQR back in to your new wallet address.</li>
                </div>
                <div className="container mt-4">
                    <h5>3. How it works?</h5>
                    <li>Enter your 12 word passphrase of your <strong>old</strong> wallet address in the box below. </li>
                    <li>Press submit and the new coins will arrive about 5 minutes later in to your new wallet address.</li>
                    <li>The old coins will be moved into a Qredit controlled address.</li>
                </div>
                <div className="container mt-4">
                    <h5>4. Start Process</h5>
                    <div className="form-group float-label">
                        <input type="text" className="form-control" autoComplete="" onChange={handleSwapFormChange} value={state.swapform || ''} />
                        <label className={"form-control-label " + (state.swapform ? 'active' : '')}>Enter 12 Word Passphrase for Old Wallet.</label>
                    </div>
                </div>
                <div className="row justify-content-center zl_securebackup_btn ">
                    <div className="col-6">
                        <Link onClick={e => doSwap(e)} className="mx-auto" disabled={state.buttondisable ? true : false}>Submit</Link>
                    </div>
                </div>
                <div className="container mt-4">
                    <li>Your coins will be sent to your Qredit Motion wallet with the following address:<strong> {state.user ? state.user.master_qredit_address : ''} </strong></li>
                    <li>Make sure to have a backup of your keys in Qredit Motion. Without your keys, your coins won't be recoverable if you lose access to Qredit Motion.</li>
                </div>


                <div className="card mt-4">
                    <div className="card-header pb-0">
                        <h6 className="mb-1">Swap History</h6>
                    </div>
                    <div className="hr-thin"></div>
                    <div className="card-body px-0 pt-1">

                        <div className="list-group list-group-flush">


                            <InfiniteScroll
                                dataLength={transactionlist.length}
                                next={fetchMoreData}
                                hasMore={state.hasMore || false}
                                loader={
                                    <p style={{ textAlign: "center" }}>
                                        <b>Loading...</b>
                                    </p>
                                }
                                height={400}
                                endMessage={
                                    <p style={{ textAlign: "center" }}>
                                        <b>No More Records</b>
                                    </p>
                                }
                            >
                                {transactionlist.map((transactionitem, index) => (

                                    <>
                                        <div className="row bg-transactions">
                                            <div className="col align-self-center pl-4">
                                                <div className="text-default">
                                                    <h6 className="text-success">{parseFloat(transactionitem.incomingamount).toFixed(8)} XQR (Old)</h6>
                                                </div>
                                                <h6 className="mb-1" onClick={e => doCopyTxid(e, transactionitem.incomingtxid || '')}>{'ID: ' + (transactionitem.incomingtxid ? transactionitem.incomingtxid.substr(0, 7) + '...' + transactionitem.incomingtxid.substr(-7) : 'N/A')}</h6>

                                                <div className="text-default">
                                                    <h6 className="text-success">{transactionitem.outgoingamount ? parseFloat(transactionitem.outgoingamount).toFixed(8) : 'N/A'} XQR (New)</h6>
                                                </div>
                                                <h6 className="mb-1" onClick={e => doCopyTxid(e, transactionitem.outgoingtxid || '')}>{'ID: ' + (transactionitem.outgoingtxid ? transactionitem.outgoingtxid.substr(0, 7) + '...' + transactionitem.outgoingtxid.substr(-7) : 'N/A')}</h6>

                                            </div>

                                            <div className="col pl-4">
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        <p className="small text-secondary mb-0"><strong>Timestamp:</strong>&nbsp;{transactionitem.created_at.substr(0, 19).replace('T', ' at ')}</p>
                                                        <p className="small text-secondary mb-0"><strong>Swap Wallet:</strong>&nbsp;{transactionitem.receiveaddress}</p>
                                                        <p className="small text-secondary mb-0"><strong>New Wallet:</strong>&nbsp;{transactionitem.toaddress || 'N/A'}</p>
                                                        <p className="small text-secondary"><strong>Status:</strong>&nbsp;{transactionitem.status}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hr-thin"></div>
                                    </>

                                ))}
                            </InfiniteScroll>

                        </div>

                    </div>
                </div>

            </div>
        </section>
        /*<section className="zl_securebackup_page"> 
            <HeadingModule name={'Swap your old XQR coins'} />
            <div className="zl_SecureBackup_heading">
                <h3>Fill in your 12 word passphrase from the old Qredit Blockchain</h3>
                <h3>Qredit addresses on the old blockchain starts with a Q</h3>
            </div>
            <div className="zl_securebackup_row row">
                {inputField.map((inputValue, i) => (
                    <div className="zl_securebackup_col_3 col-lg-3 col-md-6" key={inputValue}>
                        <div className="zl_securebackup_input_content position-relative">
                            <p className="zl_securebackup_input_text">{inputValue}</p>
                            <input type="text" className="zl_securebackup_input" name={`input${inputValue}`} placeholder="_____" defaultValue={value ? value : ""} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="zl_securebackup_btn">
                {value === "" ? <Link to={'#'} onClick={() => { ("Lorem") }} className="mx-auto">Show</Link>
                    : <Link to={'#'} onClick={() => { ("") }} className="mx-auto">Hide</Link>}
            </div>
        </section>*/

    );
}

export default connect(null, null)(SwapOldXQRModule);