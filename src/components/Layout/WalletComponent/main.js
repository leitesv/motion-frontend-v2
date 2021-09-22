import React, { useState } from "react";
import { connect } from "react-redux";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import { Button, FormControl } from 'react-bootstrap'
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import copy from "copy-to-clipboard";

import AllTransactionList from "../TransactionListComponent/AllTransactionList";

import store from "../../../store/index";
import { updateStore } from "../../../store/actions/index";

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
                <div className="zl_send_recive_content">
                    <div className="zl_send_recive_content_row">
                        <div className="zl_send_recive_content_column">
                            <div className="zl_send_recive_inner_content">
                                <h3 className="zl_send_recive_heading">
                                    <svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
                                    </svg>
                                    Send {props.currencyid.name}
                                </h3>



                                <div className="zl_send_currency_input_content zl_send_qr_addressxx">

                                    <FormControl
                                        placeholder="To Address"
                                        style={{ width: "calc(100% - 72px)", marginRight: "2px" }}
                                        id="send_address"
                                        onChange={handleSendFormChange}
                                    />
                                    <QRCode
                                        value="EYdNhC7hGgHuL2sF20p2dLv"
                                        bgColor={"#3D476A"}
                                        fgColor={"#CAD3F2"}
                                        size={32}
                                        className="zl_dark_theme_qrcode"
                                    />
                                    <QRCode
                                        value="EYdNhC7hGgHuL2sF20p2dLv"
                                        bgColor={"#EFF0F2"}
                                        fgColor={"#3D476A"}
                                        size={32}
                                        className="zl_light_theme_qrcode"
                                    />

                                    <svg width="32" height="32" style={{ marginLeft: "2px" }} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V11C0 12.1046 0.89543 13 2 13H11C12.1046 13 13 12.1046 13 11V2C13 0.895431 12.1046 0 11 0H2ZM7.5 5C6.67157 5 6 5.67157 6 6.5C6 7.32843 6.67157 8 7.5 8H9.5C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5H7.5Z" fill="#828CAE"></path></svg>


                                </div>
                                <div className="zl_send_currency_input_content">
                                    <div className="zl_send_currency_btn_text">
                                        <div className="zl_send_currency_text">
                                            <p><span>Balance: {walletbalance} {props.currencyid.ticker}</span></p>
                                        </div>
                                    </div>
                                    <FormControl
                                        type="number"
                                        placeholder="Amount to Send"
                                        id="send_amount"
                                        onChange={handleSendFormChange}
                                    />
                                    <div className="zl_send_currency_input_btns">
                                        <Button>10%</Button>
                                        <Button>25%</Button>
                                        <Button>50%</Button>
                                        <Button>75%</Button>
                                        <Button>All</Button>
                                    </div>
                                </div>
                                <div className="zl_send_currency_input_content">
                                    <FormControl
                                        type="password"
                                        placeholder="Your Password"
                                        id="send_password"
                                        onChange={handleSendFormChange}
                                    />
                                </div>
                                <div className="zl_send_currency_text_type">
                                    <h3 className="zl_send_currency_text">€0.00</h3>
                                    <h3 className="zl_send_currency_type">EUR</h3>
                                </div>
                                <div className="zl_send_currency_btn_text">
                                    <Button onClick={doSend} className="zl_send_currency_btn">
                                        Send
                                    </Button>
                                    <div className="zl_send_currency_text">
                                        <p>Network Fee<span>0.00 {props.currencyid.ticker}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="zl_send_recive_content_column">
                            <div className="zl_send_recive_inner_content">
                                <h3 className="zl_send_recive_heading zl_recive_heading">
                                    <svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
                                    </svg>
                                    Receive {props.currencyid.name}
                                </h3>
                                <div className="zl_recive_address_content">
                                    <p className="zl_recive_address_heading">Address</p>
                                    <div className="zl_recive_copy_address_content">
                                        <Button onClick={(e) => doCopyAddress(e, walletaddress)}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.48116 0H12.5365C13.3244 0 13.9653 0.641 13.9653 1.42887V4.78252H12.661V1.42887C12.661 1.36022 12.6051 1.30435 12.5365 1.30435H1.48116C1.4125 1.30435 1.35663 1.36022 1.35663 1.42887V12.4842C1.35663 12.5529 1.4125 12.6087 1.48116 12.6087H4.73024V13.9131H1.48116C0.693287 13.9131 0.0522861 13.2721 0.0522861 12.4842V1.42887C0.0523291 0.641 0.693287 0 1.48116 0Z" fill="#CAD3F2" />
                                                <path d="M7.46358 6.08691H18.5188C19.3068 6.08691 19.9478 6.72791 19.9478 7.51583V18.5711C19.9477 19.3591 19.3068 20.0001 18.5188 20.0001H7.46354C6.67562 20.0001 6.03463 19.3591 6.03463 18.5712V7.51583C6.03458 6.72791 6.67567 6.08691 7.46358 6.08691ZM7.46349 18.6957H18.5188C18.5875 18.6957 18.6434 18.6398 18.6434 18.5712V7.51583C18.6434 7.44713 18.5875 7.39126 18.5188 7.39126H7.46354C7.39484 7.39126 7.33897 7.44713 7.33897 7.51583V18.5712H7.33893C7.33893 18.6398 7.39484 18.6957 7.46349 18.6957Z" fill="#CAD3F2" />
                                            </svg>
                                        </Button>
                                        <p>{walletaddress}</p>
                                    </div>
                                    <div className="zl_recive_address_qr_code">
                                        <QRCode
                                            value={walletaddress}
                                            bgColor={"transparent"}
                                            fgColor={"#CAD3F2"}
                                            size={166}
                                            className="zl_dark_theme_qrcode"
                                        />
                                        <QRCode
                                            value={walletaddress}
                                            bgColor={"transparent"}
                                            fgColor={"#3D476A"}
                                            size={166}
                                            className="zl_light_theme_qrcode"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
                {/*<div className="zl_transaction_list">
                    <h3 className="zl_transaction_list_main_heading">
                        Transaction
                        <Link to={'/transactions'}>See All</Link>
                    </h3>
                    <AllTransactionList value={props} />
                </div>*/}
            </div>
        </>
    );
}

export default connect(null, null)(MainComponent);
