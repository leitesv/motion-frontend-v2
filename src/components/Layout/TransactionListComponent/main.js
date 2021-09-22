import React, { useState } from "react";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import copy from "copy-to-clipboard";

import AllTransactionList from "../TransactionListComponent/AllTransactionList";


// SERVICES
import userService from '../../../services/userService';



const MainComponent = (props) => {
    // date picker
    //const [dateRange, setDateRange] = useState([null, null]);
    //const [startDate, endDate] = dateRange;

    // send btn
    const [sendForm, setSendForm] = useState({});

    //const handleToggle = () => {
    //    setSend(!send);
    //};


    const [walletaddress, setWalletaddress] = useState('');
    const [walletbalance, setWalletbalance] = useState(0);


    React.useEffect(() => {
        // Runs after the first render() lifecycle


        (async () => {

            let walletid = props._id

            let res = await userService.getwalletaddresses(walletid);

            if (res.status === true) {
                setWalletaddress(res.addresslist[0].address);
            }

            let resbal = await userService.getwalletbalance(walletid);

            if (resbal.status === true) {
                setWalletbalance(resbal.balance);
            }

        })();


    }, [props]);

    const handleReset = () => {
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        setSendForm({});
    };

    const doSend = (e) => {

        let walletid = props._id;

        var contactid = sendForm.send_contactid || null;
        var address = sendForm.send_address || null;
        var amount = sendForm.send_amount || null;
        var pass = sendForm.send_password || null;

        var error = false;

        if (isNaN(parseFloat(amount))) {
            error = true;
        }

        if (!isFinite(amount)) {
            error = true;
        }

        if (contactid === null && (address === null || address == '')) {
            error = true;
        }

        if (error === true) {

            toast.error('Form error');

        }
        else {

            (async () => {

                let res = await userService.sendtransaction(walletid, contactid, address, amount, pass);

                if (res.status === true) {

                    toast.success(res.message);

                    handleReset();


                }
                else {

                    toast.error(res.message);

                }

            })();

        }

    };

    const doCopyAddress = (e, address) => {

        e.preventDefault();

        copy(address);

        toast.success('Address Copied to Clipboard');

    };

    const doCopyTxid = (e, txid) => {

        e.preventDefault();

        copy(txid);

        toast.success('Transaction ID Copied to Clipboard');

    };

    const handleSendFormChange = event => {

        if (event.target.type === 'checkbox') {
            event.target.value = event.target.checked;
        }

        var currentSendForm = sendForm;

        currentSendForm[event.target.id] = event.target.value;

        setSendForm(currentSendForm);

    };

    let transactions = [];


    return (
        <>
            <div className="zl_chart_component active">
                <div className="zl_transaction_list">
                    <h3 className="zl_transaction_list_main_heading">
                        Transaction
                        <Link to={'/transactions'}>See All</Link>
                    </h3>
                    <AllTransactionList value={props} />
                </div>
            </div>
        </>
    );
}

export default connect(null, null)(MainComponent);
