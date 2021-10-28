import React, { useState } from "react";
import { connect } from "react-redux";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import { Modal, Button, FormControl } from 'react-bootstrap'
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import copy from "copy-to-clipboard";

import Select, { components } from 'react-select';

import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import parse from "html-react-parser";

import AllTransactionList from "../TransactionListComponent/AllTransactionList";

import store from "../../../store/index";
import { updateStore } from "../../../store/actions/index";

// SERVICES
import userService from '../../../services/userService';



const MainComponent = (props) => {
    // date picker
    //const [dateRange, setDateRange] = useState([null, null]);
    //const [startDate, endDate] = dateRange;

    const [state, setState] = React.useState(store.getState());

    // send btn
    const [sendForm, setSendForm] = useState({});

    const [sendType, setSendType] = useState('send');

    //const handleToggle = () => {
    //    setSend(!send);
    //};

    const [modalData, setModalData] = useState(null);
    const [modalButton, setModalButton] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalCode, setModalCode] = useState(null);;
    const [showModal, setShowModal] = useState(false);
    const [modalButtonClick, setModalButtonClick] = useState(false);
    

    const [walletaddress, setWalletaddress] = useState('');
    const [walletbalance, setWalletbalance] = useState(0);

    const [colorOptions, setColorOptions] = useState([]);
    const [colorStyles, setColorStyles] = useState({});
    
    const [delegateList, setDelegateList] = useState([]);
    const [currentVote, setCurrentVote] = useState(null);
    const [currentVoteName, setCurrentVoteName] = useState('');

	const [colorOptionsVote, setColorOptionsVote] = useState([]);
    const [colorStyles2, setColorStyles2] = useState({});

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

			let resd = await userService.getdelegatelist(walletid);
			
			if (resd.status === true) {
				setDelegateList(resd.delegates);
			}

			let cvote = await userService.getwalletvotes(walletid);
			
			if (cvote.vote)
			{
				setCurrentVote(cvote.vote);

				var currentSendForm = {};

				Object.assign(currentSendForm, sendForm);

				currentSendForm['send_vote'] = cvote.vote;
			
				setSendForm(currentSendForm);
            
				let cvotename = '';
				
				if (resd.status === true) {
				
					for (let i = 0; i < resd.delegates.length; i++)
					{
						let ditem = resd.delegates[i];
						if (ditem.publicKey === cvote.vote)
						{
					
							setCurrentVoteName(ditem.username);
					
						}
					}
				
				}
            
            }
            
        	var colourOptionsVote = [];

			if (resd.status === true) {
			
				for (let i = 0; i < resd.delegates.length; i++) {

					let thisdelegate = resd.delegates[i];

					let cvalue = thisdelegate.publicKey;
					let clabel = thisdelegate.username;
				
					let cdetails = { value: cvalue, label: clabel };

					colourOptionsVote.push(cdetails);

				}
			
			}
            
            
			const userid = state.user._id || '';

            var colourOptions = [];

            let contacts = await userService.getcontacts(0, 100);

            if (contacts.status === true) {

                for (let i = 0; i < contacts.contactlist.length; i++) {

                    let thiscontact = contacts.contactlist[i];

                    let cvalue = userid === thiscontact.userid_b._id ? thiscontact.userid_a._id : thiscontact.userid_b._id;
                    let ccolor = "/api/profileimage/" + (userid === thiscontact.userid_b._id ? thiscontact.userid_a._id : thiscontact.userid_b._id);
                    let clabel = (userid === thiscontact.userid_b._id ? thiscontact.userid_a.givenname : thiscontact.userid_b.givenname) + ' ' + (userid === thiscontact.userid_b._id ? thiscontact.userid_a.familyname : thiscontact.userid_b.familyname) + ' (' + (userid === thiscontact.userid_b._id ? thiscontact.userid_a.email : thiscontact.userid_b.email) + ')';

                    let cdetails = { value: cvalue, color: ccolor, label: clabel };

                    colourOptions.push(cdetails);

                }

            }


            const dot = (color) => ({
                alignItems: 'center',
                display: 'flex',
                ':before': {
                    background: 'url(' + color + ')',
                    backgroundSize: 'contain',
                    borderRadius: 5,
                    content: '" "',
                    display: 'block',
                    marginRight: 8,
                    height: 30,
                    width: 30,
                    minWidth: 30
                },
            });

            const colourStyles = {
                control: styles => ({ ...styles }),

                option: (styles, { data, isDisabled, isFocused, isSelected }) => {

                    return {
                        ...styles,
                        ...dot(data.color),
                        backgroundColor: isDisabled
                            ? null
                            : isSelected
                                ? '#BBF'
                                : isFocused
                                    ? '#DDF'
                                    : null,
                        cursor: isDisabled ? 'not-allowed' : 'default',

                        ':active': {
                            ...styles[':active'],
                            backgroundColor:
                                !isDisabled && (isSelected ? '#FFF' : '#DDF'),
                        },
                    };
                },

                input: styles => ({ ...styles }),
                placeholder: styles => ({ ...styles }),
                singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
            };

            const colourStyles2 = {
                control: styles => ({ ...styles }),

                option: (styles, { data, isDisabled, isFocused, isSelected }) => {

                    return {
                        ...styles,
                        backgroundColor: isDisabled
                            ? null
                            : isSelected
                                ? '#BBF'
                                : isFocused
                                    ? '#DDF'
                                    : null,
                        cursor: isDisabled ? 'not-allowed' : 'default',

                        ':active': {
                            ...styles[':active'],
                            backgroundColor:
                                !isDisabled && (isSelected ? '#FFF' : '#DDF'),
                        },
                    };
                },

                input: styles => ({ ...styles }),
                placeholder: styles => ({ ...styles }),
                singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
            };
            
			setColorOptions(colourOptions);
			setColorStyles(colourStyles);
			setColorStyles2(colourStyles2);

			setColorOptionsVote(colourOptionsVote);

        })();


    }, [props]);

    const closeModal = () => {
    
    	setModalData(null);
    	setModalCode(null);
    	setModalButton(null);
    	setModalTitle(null);

    	setModalButtonClick(false);
    	
    	setShowModal(false);
    	
    };

    const buttonModal = () => {

    	setModalData(null);
    	setModalCode(null);
    	setModalButton(null);
    	setModalTitle(null);

    	setModalButtonClick(true);

		setShowModal(false);
		
    };

    const scanQR = (e) => {

        e.preventDefault();
                
        let processing = false;

        let htmlData = (
            <BarcodeScannerComponent
                width={'100%'}
                height={400}
                onUpdate={(err, result) => {
                    if (result) {

                        if (processing === false) {

                            (async () => {
                            
                            	processing = true;

								var currentform = sendForm;
								
								currentform.send_address = result;
								
								setSendForm(currentform);
                                
                                closeModal();

                            })();

                        }

                    }
                }}
            />
        );

		setModalData(null);
    	setModalCode(htmlData);
    	setModalButton(null);
    	setModalTitle('Scan QR Contact');
    	setModalButtonClick(false);
    	setShowModal(true);

    };
    
    const handleReset = () => {
        //Array.from(document.querySelectorAll("input")).forEach(
        //    input => (input.value = "")
        //);
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

	const doVote = (e) => {
	
		e.preventDefault();

		
		var tovote = sendForm.send_vote;
		var pass = sendForm.send_password;



	
		var error = false;
		
		(async () => {

			let walletid = props._id;

			let res = await userService.sendqreditvote(walletid, tovote, pass);

			if (res.status === true)
			{
			
				toast.success(res.message);
				
				setSendType('send');
            
			}
			else
			{
		
				toast.error(res.message);

			}

		})();
		
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
        
        var currentSendForm = {};
            
        Object.assign(currentSendForm, sendForm);
            
        currentSendForm[event.target.id] = event.target.value;

        setSendForm(currentSendForm);

    };

    const handleVoteSendFormChange = (selectedOption) => {

        if (selectedOption !== null) {

            var currentSendForm = {};
            
            Object.assign(currentSendForm, sendForm);

            currentSendForm['send_vote'] = selectedOption.value;
			
            setSendForm(currentSendForm);

        }
        else {
        
        	var currentSendForm = {};

            Object.assign(currentSendForm, sendForm);

            currentSendForm['send_vote'] = null;
			
            setSendForm(currentSendForm);
        }

    };
    
    const handleContactSendFormChange = (selectedOption) => {

        if (selectedOption !== null) {

            var currentSendForm = {};
            
            Object.assign(currentSendForm, sendForm);

            currentSendForm['send_contactid'] = selectedOption.value;

			currentSendForm['send_address'] = '';
			
            setSendForm(currentSendForm);

            document.querySelector('#send_address').disabled = true;;

        }
        else {

            var currentSendForm = sendForm;

            currentSendForm['send_contactid'] = null;

            setSendForm(currentSendForm);

            document.querySelector('#send_address').disabled = false;;

        }

    };

    const handleSendPercent10 = (e) => {

		e.preventDefault();
		
		try {
			var amount = (walletbalance * 0.10).toFixed(8);
		} catch (e) {
			var amount = 0;
		}	

		var currentSendForm = {};
		
		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;
		
		setSendForm(currentSendForm);
            
    };

    const handleSendPercent25 = (e) => {

		e.preventDefault();
		
		try {
			var amount = (walletbalance * 0.25).toFixed(8);
		} catch (e) {
			var amount = 0;
		}	

		var currentSendForm = {};
		
		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;
		
		setSendForm(currentSendForm);
            
    };
    
    const handleSendPercent50 = (e) => {

		e.preventDefault();
		
		try {
			var amount = (walletbalance * 0.50).toFixed(8);
		} catch (e) {
			var amount = 0;
		}	

		var currentSendForm = {};
		
		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;
		
		setSendForm(currentSendForm);
            
    };

    const handleSendPercent75 = (e) => {

		e.preventDefault();
		
		try {
			var amount = (walletbalance * 0.75).toFixed(8);
		} catch (e) {
			var amount = 0;
		}	

		var currentSendForm = {};
		
		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;
		
		setSendForm(currentSendForm);
            
    };

    const handleSendPercent100 = (e) => {

		e.preventDefault();
		
		try {
			var amount = walletbalance;
		} catch (e) {
			var amount = 0;
		}	

		var currentSendForm = {};
		
		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;
		
		setSendForm(currentSendForm);
            
    };
    
    let transactions = [];


    return (
        <>
            <div className="zl_chart_component active">
                <div className="zl_send_recive_content">
                    <div className="zl_send_recive_content_row">
                        <div className="zl_send_recive_content_column">
                        	{
                        		props.currencyid.ticker === "XQR" || props.currencyid.ticker === 'ARK' ?
                        		(<div style={{marginBottom: '-40px'}}>
                        			<Button className={sendType==='send'?"btn-primary":"btn-secondary"} onClick={(e) => setSendType('send')}>Send</Button>
                        			&nbsp;
                        			<Button className={sendType==='vote'?"btn-primary":"btn-secondary"} onClick={(e) => setSendType('vote')}>Vote</Button>
                        		</div>):""
                        	}
                        	{sendType==='send'?
                        	(
                            <div className="zl_send_recive_inner_content">
                                <h3 className="zl_send_recive_heading">
                                    <svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
                                    </svg>
                                    Send {props.currencyid.name}
                                </h3>



                                <div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>

                                    <FormControl
                                        placeholder="To Address"
                                        style={{ width: "calc(100% - 36px)", marginRight: "2px" }}
                                        id="send_address"
                                        value={sendForm.send_address || ''}
                                        onChange={handleSendFormChange}
                                    />
                                    <QRCode
                                    	onClick={e => scanQR(e)}
                                        value="EYdNhC7hGgHuL2sF20p2dLv"
                                        bgColor={"#3D476A"}
                                        fgColor={"#CAD3F2"}
                                        size={32}
                                        className="zl_dark_theme_qrcode"
                                    />
                                    <QRCode
                                    	onClick={e => scanQR(e)}
                                        value="EYdNhC7hGgHuL2sF20p2dLv"
                                        bgColor={"#EFF0F2"}
                                        fgColor={"#3D476A"}
                                        size={32}
                                        className="zl_light_theme_qrcode"
                                    />

                                </div>
                                
                                <div className="zl_send_currency_input_content">

									<div style={{width: '100%'}}>
									<Select
										placeholder={'Select Contact...'}
										options={colorOptions}
										styles={colorStyles}
										isClearable={true}
										isSearchable={true}
										id="send_contact"
										onChange={handleContactSendFormChange}
									/>
									</div>

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
										value={sendForm.send_amount || ''}
                                        onChange={handleSendFormChange}
                                    />
                                    <div className="zl_send_currency_input_btns">
                                        <Button onClick={handleSendPercent10}>10%</Button>
                                        <Button onClick={handleSendPercent25}>25%</Button>
                                        <Button onClick={handleSendPercent50}>50%</Button>
                                        <Button onClick={handleSendPercent75}>75%</Button>
                                        <Button onClick={handleSendPercent100}>All</Button>
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
                            ):(
                            <div className="zl_send_recive_inner_content">
                                <h3 className="zl_send_recive_heading">
                                    <svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
                                    </svg>
                                    Vote {props.currencyid.name} Delegate
                                </h3>
								{currentVote!==null?
									(<>
										<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>
											<label className="form-control-label primary-color">You must first Un-vote your current vote prior to making a new vote.</label>
											<FormControl
												type="text"
												readOnly
												defaultValue={currentVoteName}
											/>
											<label className="form-control-label primary-color" style={{marginTop:'-8px', fontSize:'10px'}}>Current Vote</label>

										</div>
										<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>
											<FormControl
												type="password"
												autoComplete="new-password"
												placeholder="Your Password"
												id="send_password"
												onChange={handleSendFormChange}
											/>
											<label className="form-control-label primary-color" style={{marginTop:'-8px', fontSize:'10px'}}>Your Password</label>
										</div>
										<div className="zl_send_currency_btn_text">
											<Button onClick={doVote} className="zl_send_currency_btn">
												Unvote
											</Button>
										</div>
									</>):(<>
										<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>
											<label className="form-control-label primary-color">Select the delegate that you wish to vote for.</label>
											<div style={{width: '100%'}}>
											<Select
												placeholder={'Select Delegate...'}
												options={colorOptionsVote}
												isClearable={true}
												isSearchable={true}
												id="send_vote"
												onChange={handleVoteSendFormChange}
											/>
											<label className="form-control-label primary-color" style={{marginTop:'-8px', fontSize:'10px'}}>Select Delegate</label>

											</div>
										</div>
										<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>
											<FormControl
												type="password"
												autoComplete="new-password"
												placeholder="Your Password"
												id="send_password"
												onChange={handleSendFormChange}
											/>
											<label className="form-control-label primary-color" style={{marginTop:'-8px', fontSize:'10px'}}>Your Password</label>
										</div>
										<div className="zl_send_currency_btn_text">
											<Button onClick={doVote} className="zl_send_currency_btn">
												Vote
											</Button>
										</div>
									</>)
								}
                            </div>
                            )}
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
                                        	onClick={e => scanQR(e)}
                                            value={walletaddress}
                                            bgColor={"transparent"}
                                            fgColor={"#CAD3F2"}
                                            size={166}
                                            className="zl_dark_theme_qrcode"
                                        />
                                        <QRCode
                                        	onClick={e => scanQR(e)}
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

            </div>
            
        <Modal centered show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle || ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalData !== null ? parse(modalData) : modalCode}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={buttonModal} style={(modalButton === null ? { display: 'none' } : {})}>
                    {modalButton || ''}
                </Button>
            </Modal.Footer>
        </Modal>
            
        </>
    );
}

export default connect(null, null)(MainComponent);
