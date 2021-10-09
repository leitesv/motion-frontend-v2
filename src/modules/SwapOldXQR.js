import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import copy from "copy-to-clipboard";
import { useHistory } from "react-router-dom"

import store from "../store/index";
import { updateStore } from "../store/actions/index";

// SERVICES
import userService from '../services/userService';


const SwapOldXQRModule = ({ props }) => {

    const [state, setState] = React.useState(store.getState());
    const [transactionList, setTransactionList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [shownItems, setShownItems] = useState(10);

    const [swapForm, setSwapForm] = useState(null);
    const [buttonDisable, setButtonDisable] = useState(false);

	let history = useHistory();

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
            
                setState({ user: res.user });

                store.dispatch(updateStore({ key: 'user', value: res.user }));

                if (!state.userImages || !state.userImages.userid) {

                    let resi = await userService.getimages();

                    if (resi.status === true) {
                        store.dispatch(updateStore({ key: 'userImages', value: resi.userimages }));
                    }
                    
                }

				setShownItems(10);

				let rest = await userService.getswaptransactions(0, 10);

				if (rest.status === true) {
					setTransactionList(rest.transactionlist);
					setHasMore(rest.hasmore);
				}


            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                history.push('/login/');

            }

        })();


    }, []);

    const refresh = () => {

        (async () => {

            setShownItems(10);

            let res = await userService.getswaptransactions(0, 10);

            if (res.status === true) {
                setTransactionList(res.transactionlist);
                setHasMore(res.hasmore);
            }

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = shownItems || 10;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setShownItems( newCount );

            let res = await userService.getswaptransactions(skip, limit);

            if (res.status === true) {

                let newhistory = transactionList.concat(res.transactionlist);

                setTransactionList(newhistory);
                setHasMore(res.hasmore);
            }

        })();
    };

    const handleSwapFormChange = event => {

        setSwapForm(event.target.value);

    };

    const doSwap = (e) => {

        e.preventDefault();

        var haserrors = false;

        if (!swapForm || swapForm === "") {
            haserrors = true;
        }

        if (haserrors === true) {
            toast.error('Error in your inputs, check for errors below');
        }

        if (haserrors === false) {

            setButtonDisable(true);

            (async () => {

                let res = await userService.doqreditswap(swapForm);
                
                setButtonDisable(null);

                if (res.status === true) {
                	setSwapForm(null);
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

    return (
        <section className="zl_securebackup_page">

            <div className="main-container primary-color">
                <div className="mt-4">

                    <h2><strong>Qredit Autoswapper</strong></h2>

                </div>

                <div className="mt-4">
                    <h6 className="text-secondary mb-1">Convert your old XQR to the new XQR chain</h6><br />
                    <h5>1. About Old XQR</h5>
                    <li>Qredit is a blockchain with it's own native XQR coins.</li>
                    <li>If you are an "old" XQR user with coins on the old blockchain with wallet addresses starting with a Q.</li>
                    <li>You can use this import function to swap your old XQR to your new wallet address starting with an X.</li>
                </div>
                <div className="mt-4">
                    <h5>2. Swap Ratio</h5>
                    <li>The swap ratio is 10:1.</li>
                    <li>If you send 1000 XQR "from the old chain", you will receive 100 XQR back in to your new wallet address.</li>
                </div>
                <div className="mt-4">
                    <h5>3. How it works?</h5>
                    <li>Enter your 12 word passphrase of your <strong>old</strong> wallet address in the box below. </li>
                    <li>Press submit and the new coins will arrive about 5 minutes later in to your new wallet address.</li>
                    <li>The old coins will be moved into a Qredit controlled address and discarded.</li>
                </div>
                <div className="mt-4">
                    <h5>4. Start Process</h5>
                    
                    <label className="form-control-label">Enter the 12 Word Passphrase for your <strong>Old Wallet</strong>, once space between each word.</label>
					<div class="input-group mb-3">
					  <input type="text" class="form-control" placeholder="Enter Old Chain Passphrase" aria-label="Enter Old Chain Passphrase" aria-describedby="basic-addon2" autoComplete="" onChange={handleSwapFormChange} value={swapForm} />
					  <div class="input-group-append">
						<button onClick={e => doSwap(e)} class="btn btn-success" type="button">Submit Swap</button>
					  </div>
					</div>

                </div>

                <div className="mt-4">
                    <li>Your coins will be sent to your Qredit Motion wallet with the following address:<strong> {state.user ? state.user.master_qredit_address : ''} </strong></li>
                    <li>Make sure to have a backup of your passphrase in Qredit Motion. Without this, your coins will not be recoverable if you lose access to your account.</li>
                </div>


                <div className="card mt-4" style={{color: '#000'}}>
                    <div className="card-header">
                        <h5 style={{color: '#000'}} className="mb-1">Swap History</h5>
                    </div>
                    <div className="card-body px-0 pt-1">

                        <div className="list-group list-group-flush">


                            <InfiniteScroll
                                dataLength={transactionList.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
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
                                {transactionList.map((transactionitem, index) => (

                                    <>
                                        <div className="row bg-transactions" style={{backgroundColor: index%2==0?'rgba(0,0,0,.03)':'#fff'}}>
                                            <div className="col pl-4" style={{flex: '0', minWidth: '250px'}}>
                                                <p className="small text-danger mb-0"><strong>-{parseFloat(transactionitem.incomingamount).toFixed(8)}</strong> XQR (Old)</p>
                                                <p style={{cursor: 'pointer'}} className="small mb-0" onClick={e => doCopyTxid(e, transactionitem.incomingtxid || '')}>{'TxID: ' + (transactionitem.incomingtxid ? transactionitem.incomingtxid.substr(0, 7) + '...' + transactionitem.incomingtxid.substr(-7) : 'N/A')}</p>
                                                <p className="small text-success mb-0"><strong>+{transactionitem.outgoingamount ? parseFloat(transactionitem.outgoingamount).toFixed(8) : 'N/A'}</strong> XQR (New)</p>
                                                <p style={{cursor: 'pointer'}} className="small mb-1" onClick={e => doCopyTxid(e, transactionitem.outgoingtxid || '')}>{'TxID: ' + (transactionitem.outgoingtxid ? transactionitem.outgoingtxid.substr(0, 7) + '...' + transactionitem.outgoingtxid.substr(-7) : 'N/A')}</p>

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

    );
}

export default connect(null, null)(SwapOldXQRModule);