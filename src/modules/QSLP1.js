import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav, Modal, Button, FormControl } from 'react-bootstrap';

import { useHistory } from "react-router-dom"

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import QRCode from 'qrcode.react';
import copy from "copy-to-clipboard";

import Select, { components } from 'react-select';

import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import parse from "html-react-parser";


import store from "../store/index";
import { updateStore } from "../store/actions/index";

// SERVICES
import userService from '../services/userService';




const QSLP1Module = ({ props }) => {

    const [state, setState] = React.useState(store.getState());

    // send btn
    const [sendForm, setSendForm] = useState({});

    //const handleToggle = () => {
    //    setSend(!send);
    //};

    const [modalData, setModalData] = useState(null);
    const [modalButton, setModalButton] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalCode, setModalCode] = useState(null);;
    const [showModal, setShowModal] = useState(false);
    const [modalButtonClick, setModalButtonClick] = useState(false);

    const [selectedToken, setSelectedToken] = useState(null);


    const [walletaddress, setWalletaddress] = useState('');
    const [walletbalance, setWalletbalance] = useState(0);

    const [colorOptions, setColorOptions] = useState([]);
    const [colorStyles, setColorStyles] = useState({});
    
    const [colorOptions2, setColorOptions2] = useState([]);
    const [colorStyles2, setColorStyles2] = useState({});

    const [theAction, setTheAction] = useState(null);

    const [theTab, setTheTab] = useState(null);

	let history = useHistory()
	
    React.useEffect(() => {
        // Runs after the first render() lifecycle

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

				var colourOptions2 = [];
            	
				let tokens2 = await userService.getqslptokens(res.user.master_qredit_address);

				if (tokens2.status === true) {


					for (let i = 0; i < tokens2.tokens.length; i++) {

						let thistoken = tokens2.tokens[i];

						let cvalue = thistoken.tokenIdHex;
						
						let tokeninfo = await userService.getqslptokeninfo(cvalue);

						let clabel = tokeninfo.tokeninfo.tokenDetails.name + " (" + thistoken.tokenBalance + " " + tokeninfo.tokeninfo.tokenDetails.symbol + ")";
						
						let cdetails = { value: cvalue, label: clabel };

						colourOptions2.push(cdetails);

					}

				}


				var colourOptions3 = [];

				let tokens3 = await userService.getaslptokens(res.user.master_ark_address);

				if (tokens3.status === true) {


					for (let i = 0; i < tokens3.tokens.length; i++) {

						let thistoken = tokens3.tokens[i];

						let cvalue = thistoken.tokenIdHex;
						
						let tokeninfo = await userService.getaslptokeninfo(cvalue);

						let clabel = tokeninfo.tokeninfo.tokenDetails.name + " (" + thistoken.tokenBalance + " " + tokeninfo.tokeninfo.tokenDetails.symbol + ")";
						
						let cdetails = { value: cvalue, label: clabel };

						colourOptions3.push(cdetails);

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
				
				setColorOptions2(colourOptions2);
				setColorStyles2(colourStyles2);


            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                history.push('/login/');

            }

        })();


    }, []);

    const scanQR = (e) => {

        e.preventDefault();
                
    }         
                
    const handleSendFormChange = (e) => {

        e.preventDefault();
                
    }  

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

    const doBurn = (e) => {
    
    }

    const doMint = (e) => {
    
    }
    
    const doPause = (e) => {
    
    }
    
    const doResume = (e) => {
    
    }

    const doNewOwner = (e) => {
    
    }
    
    const doCopyAddress = (e, address) => {

        e.preventDefault();

        copy(address);

        toast.success('Address Copied to Clipboard');

    };

    const handleTokenSelectFormChange = (selectedOption) => {

		setSelectedToken(selectedOption.value);

	}
	
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

    const doActionSend = (e) => {

       	setTheAction('send');

    };

    const doActionBurn = (e) => {

       	setTheAction('burn');

    };
    
    const doActionMint = (e) => {

       	setTheAction('mint');

    };
    
    const doActionPause = (e) => {

       	setTheAction('pause');

    };

    const doActionResume = (e) => {

       	setTheAction('resume');

    };
    
    const doActionNewOwner = (e) => {

       	setTheAction('newowner');

    };

    const setTabQredit = (e) => {

       	setTheTab('qredit');
       	setTheAction(null);
       	setSendForm({});
       	setSelectedToken(null);

    };

    const setTabArk = (e) => {

       	setTheTab('ark');
       	setTheAction(null);
		setSendForm({});
       	setSelectedToken(null);

    };
    
    return (
        <>
        
            <section className="zl_history_page">
                <HeadingModule name={'Tokens Wallet'} />
                <Tab.Container id="left-tabs-example" defaultActiveKey="">
                    <div className="zl_add_currency_content">
                        <h3 className="zl_bottom_content_heading">Select Token Platform</h3>
                        <Nav className="zl_add_currency_row row">
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab1" onClick={setTabQredit} className="zl_add_currency_inner_content zl_add_bitcoin_currencyx">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
												&nbsp;Qredit QSLP-1 (Fungible)
											</h3>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab2" onClick={setTabArk} className="zl_add_currency_inner_content zl_add_ethereum_currencyx">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
												&nbsp;Ark ASLP-1 (Fungible)
											</h3>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
        
                        </Nav>
                    </div>
                    <Tab.Content className="center-center">
                        <Tab.Pane eventKey="tab1">
                        
                        	<div className='primary-color' style={{textAlign: 'left'}}>
                        	Network: Qredit QSLP-1
							</div>
							
							<div style={{textAlign: 'left'}}>

								<Select
									placeholder={'Select Token...'}
									options={colorOptions2}
									styles={colorStyles2}
									isClearable={true}
									isSearchable={true}
									id="select_token"
									onChange={handleTokenSelectFormChange}
									value={selectedToken}
								/>

							</div>
							
							{selectedToken === null?(
							<div style={{textAlign: 'left', marginTop: '3px', marginBottom: '3px'}}>
							
								<button onClick={doActionSend} className={"btn" + (theAction==='send'?" btn-primary":" btn-secondary")}>Send / Receive</button> 
								&nbsp;<button onClick={doActionBurn} className={"btn" + (theAction==='burn'?" btn-primary":" btn-secondary")}>Burn</button> 
								&nbsp;<button onClick={doActionMint} className={"btn" + (theAction==='mint'?" btn-primary":" btn-secondary")}>Mint</button> 
								&nbsp;<button onClick={doActionPause} className={"btn" + (theAction==='pause'?" btn-primary":" btn-secondary")}>Pause</button> 
								&nbsp;<button onClick={doActionResume} className={"btn" + (theAction==='resume'?" btn-primary":" btn-secondary")}>Resume</button> 
								&nbsp;<button onClick={doActionNewOwner} className={"btn" + (theAction==='newowner'?" btn-primary":" btn-secondary")}>New Owner</button>
								
							</div>
							):''}
			
							{theAction === 'send'?(
							
								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Send xxx
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
																<p><span>Balance: 0.00 xxx</span></p>
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
															<p>Network Fee<span>0.00 xxx</span></p>
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
														Receive xxxx
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

							):''}

							{theAction === 'burn'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Burn xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Balance: 0.00 xxx</span></p>
															</div>
														</div>
														<FormControl
															type="number"
															placeholder="Amount to Burn"
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
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doBurn} className="btn">
															Burn Tokens
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>
									
							):''}

							{theAction === 'mint'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Mint xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Balance: 0.00 xxx</span></p>
															</div>
														</div>
														<FormControl
															type="number"
															placeholder="Amount to Mint"
															id="send_amount"
															value={sendForm.send_amount || ''}
															onChange={handleSendFormChange}
														/>

													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doMint} className="btn">
															Mint New Tokens
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}

							{theAction === 'pause'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Pause xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Current Status: xxx</span></p>
															</div>
														</div>
													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doPause} className="btn">
															Pause Token
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}
							
							{theAction === 'resume'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Resume xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Current Status: xxx</span></p>
															</div>
														</div>
													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doResume} className="btn">
															Resume Token
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}

							{theAction === 'newowner'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														New Owner for xxx
													</h3>
												
													<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>

														<FormControl
															placeholder="New Owner Address"
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
															placeholder={'Select New Owner Contact...'}
															options={colorOptions}
															styles={colorStyles}
															isClearable={true}
															isSearchable={true}
															id="send_contact"
															onChange={handleContactSendFormChange}
														/>
														</div>

													</div>
								
													<div className="zl_send_currency_btn_text">
														<Button onClick={doNewOwner} className="btn">
															Set New Ownership
														</Button>

													</div>
													
													
												</div>
											</div>
										</div>
									</div>

							):''}

                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2">



                        	<div className='primary-color' style={{textAlign: 'left'}}>
                        	Network: Ark ASLP-1
							</div>
							
							<div style={{textAlign: 'left'}}>

								<Select
									placeholder={'Select Token...'}
									options={colorOptions2}
									styles={colorStyles2}
									isClearable={true}
									isSearchable={true}
									id="select_token"
									onChange={handleTokenSelectFormChange}
									value={selectedToken}
								/>

							</div>
							
							{selectedToken === null?(
							<div style={{textAlign: 'left', marginTop: '3px', marginBottom: '3px'}}>
							
								<button onClick={doActionSend} className={"btn" + (theAction==='send'?" btn-primary":" btn-secondary")}>Send / Receive</button> 
								&nbsp;<button onClick={doActionBurn} className={"btn" + (theAction==='burn'?" btn-primary":" btn-secondary")}>Burn</button> 
								&nbsp;<button onClick={doActionMint} className={"btn" + (theAction==='mint'?" btn-primary":" btn-secondary")}>Mint</button> 
								&nbsp;<button onClick={doActionPause} className={"btn" + (theAction==='pause'?" btn-primary":" btn-secondary")}>Pause</button> 
								&nbsp;<button onClick={doActionResume} className={"btn" + (theAction==='resume'?" btn-primary":" btn-secondary")}>Resume</button> 
								&nbsp;<button onClick={doActionNewOwner} className={"btn" + (theAction==='newowner'?" btn-primary":" btn-secondary")}>New Owner</button>
								
							</div>
							):''}
			
							{theAction === 'send'?(
							
								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Send xxx
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
																<p><span>Balance: 0.00 xxx</span></p>
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
															<p>Network Fee<span>0.00 xxx</span></p>
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
														Receive xxxx
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

							):''}

							{theAction === 'burn'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Burn xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Balance: 0.00 xxx</span></p>
															</div>
														</div>
														<FormControl
															type="number"
															placeholder="Amount to Burn"
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
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doBurn} className="btn">
															Burn Tokens
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>
									
							):''}

							{theAction === 'mint'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Mint xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Balance: 0.00 xxx</span></p>
															</div>
														</div>
														<FormControl
															type="number"
															placeholder="Amount to Mint"
															id="send_amount"
															value={sendForm.send_amount || ''}
															onChange={handleSendFormChange}
														/>

													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doMint} className="btn">
															Mint New Tokens
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}

							{theAction === 'pause'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Pause xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Current Status: xxx</span></p>
															</div>
														</div>
													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doPause} className="btn">
															Pause Token
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}
							
							{theAction === 'resume'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Resume xxx
													</h3>

													<div className="zl_send_currency_input_content">
														<div className="zl_send_currency_btn_text">
															<div className="zl_send_currency_text">
																<p><span>Current Status: xxx</span></p>
															</div>
														</div>
													</div>
													
													<div className="zl_send_currency_btn_text">
														<Button onClick={doResume} className="btn">
															Resume Token
														</Button>

													</div>
												
												</div>
											</div>
										</div>
									</div>

							):''}

							{theAction === 'newowner'?(

									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														New Owner for xxx
													</h3>
												
													<div className="zl_send_currency_input_content" style={{ borderBottom: '0px'}}>

														<FormControl
															placeholder="New Owner Address"
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
															placeholder={'Select New Owner Contact...'}
															options={colorOptions}
															styles={colorStyles}
															isClearable={true}
															isSearchable={true}
															id="send_contact"
															onChange={handleContactSendFormChange}
														/>
														</div>

													</div>
								
													<div className="zl_send_currency_btn_text">
														<Button onClick={doNewOwner} className="btn">
															Set New Ownership
														</Button>

													</div>
													
													
												</div>
											</div>
										</div>
									</div>

							):''}




                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </section>
        </>
    );
}

export default connect(null, null)(QSLP1Module);