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

	const [modalData, setModalData] = useState(null);
	const [modalButton, setModalButton] = useState(null);
	const [modalTitle, setModalTitle] = useState(null);
	const [modalCode, setModalCode] = useState(null);;
	const [showModal, setShowModal] = useState(false);
	const [modalButtonClick, setModalButtonClick] = useState(false);

	const [selectedToken, setSelectedToken] = useState(null);
	const [tokenInfo, setTokenInfo] = useState({});


	const [walletaddress, setWalletaddress] = useState('');
	const [walletbalance, setWalletbalance] = useState(0);

	const [colorOptions, setColorOptions] = useState([]);
	const [colorStyles, setColorStyles] = useState({});

	const [colorOptions2, setColorOptions2] = useState([]);
	const [colorStyles2, setColorStyles2] = useState({});

	const [theAction, setTheAction] = useState(null);

	const [theTab, setTheTab] = useState(null);

	const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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



				var colourOptions2 = [];

				var tokenData = {};

				let tokens2 = await userService.getqslptokens(res.user.master_qredit_address);

				if (tokens2.status === true) {

					for (let i = 0; i < tokens2.tokens.length; i++) {

						let thistoken = tokens2.tokens[i];

						let cvalue = thistoken.tokenIdHex;

						let tokeninfo = await userService.getqslptokeninfo(cvalue);

						if (tokeninfo.tokeninfo.type === "QSLP1")
							var clabel = tokeninfo.tokeninfo.tokenDetails.name + " (" + thistoken.tokenBalance + " " + tokeninfo.tokeninfo.tokenDetails.symbol + ")";
						else
							var clabel = tokeninfo.tokeninfo.tokenDetails.name + " (QSLP2)";

							
						let cdetails = { value: cvalue, label: clabel };

						colourOptions2.push(cdetails);

						tokenData[cvalue] = {
							data: thistoken,
							info: tokeninfo.tokeninfo
						}

					}

				}
// @nayiem ucomment this to view all token data information
//console.log(tokenData);


				setTokenInfo(tokenData);

				var colourOptions3 = [];

				/*
				
				still working on ark tokens
				
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
				*/

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
					singleValue: (styles, { data }) => ({ ...styles }),
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

	const handleSendFormChange = event => {

		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm[event.target.id] = event.target.value;

		setSendForm(currentSendForm);

	};

	const handleReset = () => {
		//Array.from(document.querySelectorAll("input")).forEach(
		//    input => (input.value = "")
		//);
		setSendForm({});
	};

	const doSend = (e) => {

		setIsFormSubmitting(true);
		
		var walletid;

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var contactid = sendForm.send_contactid || null;
		var address = sendForm.send_address || null;
		var amount = sendForm.send_amount || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (isNaN(parseFloat(amount))) {
			error = true;
		}

		var balance = parseFloat(tokenInfo[selectedToken].data.tokenBalance);
		var sendamount = parseFloat(amount).toFixed(tokenInfo[selectedToken].data.tokenDecimals);

		if (parseFloat(sendamount) <= 0) {
			error = true;
		}

		if (parseFloat(sendamount) > balance) {
			error = true;
		}

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
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'SEND',
						id: selectedToken,
						qt: sendamount,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, contactid, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	};

	const doBurn = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		var amount = sendForm.burn_amount || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (isNaN(parseFloat(amount))) {
			error = true;
		}

		var balance = parseFloat(tokenInfo[selectedToken].data.tokenBalance);
		var burnamount = parseFloat(amount).toFixed(tokenInfo[selectedToken].data.tokenDecimals);

		if (parseFloat(burnamount) <= 0) {
			error = true;
		}

		if (parseFloat(burnamount) > balance) {
			error = true;
		}

		if (isNaN(parseFloat(amount))) {
			error = true;
		}

		if (!isFinite(amount)) {
			error = true;
		}

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'BURN',
						id: selectedToken,
						qt: burnamount,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doMint = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		var amount = sendForm.mint_amount || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (isNaN(parseFloat(amount))) {
			error = true;
		}

		var mintamount = parseFloat(amount).toFixed(tokenInfo[selectedToken].data.tokenDecimals);

		if (tokenInfo[selectedToken].info.tokenDetails.mintable === false) {
			error = true;
		}

		if (isNaN(parseFloat(amount))) {
			error = true;
		}

		if (!isFinite(amount)) {
			error = true;
		}

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'MINT',
						id: selectedToken,
						qt: mintamount,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doPause = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (tokenInfo[selectedToken].info.tokenDetails.pausable === false) {
			error = true;
		}

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'PAUSE',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doResume = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (tokenInfo[selectedToken].info.tokenDetails.pausable === false) {
			error = true;
		}

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'RESUME',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doNewOwner = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var contactid = sendForm.send_contactid || null;
		var address = sendForm.newowner_address || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (tokenInfo[selectedToken].info.tokenDetails.pausable === false) {
			error = true;
		}

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'NEWOWNER',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doAddMeta = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		
		var chunk = sendForm.send_chunk || null;
		var name = sendForm.send_name || null;
		var data = sendForm.send_data || null;
		
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (chunk === null || chunk === '') chunk = 0;
		
		if (name === null || name === '') error = true;
		if (data === null || data === '') error = true;

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'ADDMETA',
						id: selectedToken,
						ch: chunk || 0,
						na: name,
						dt: data
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doVoidMeta = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var txid = sendForm.send_txid || null;
		
		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress

		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;



		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'VOIDMETA',
						id: selectedToken,
						tx: txid
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}

	const doAuthMeta = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var contactid = sendForm.send_contactid || null;
		var address = sendForm.newowner_address || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;



		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'AUTHMETA',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}
	
	const doRevokeMeta = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var contactid = sendForm.send_contactid || null;
		var address = sendForm.newowner_address || null;
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;



		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'REVOKEMETA',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

	}
	
	const doClone = (e) => {

		var walletid;
		
		setIsFormSubmitting(true);

		for (let i = 0; i < state.user.wallets.length; i++) {

			let tw = state.user.wallets[i];

			if (tw.currencyid.ticker === "XQR" && theTab === 'qredit') walletid = state.user.wallets[i]._id;
			if (tw.currencyid.ticker === "ARK" && theTab === 'ark') walletid = state.user.wallets[i]._id;

		}

		var address = "XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh"; // QslpMasterAddress
		var pass = sendForm.send_password || null;

		var notes = '';

		var error = false;

		if (error === true) {

			toast.error('Form error');
			
			setIsFormSubmitting(false);

		}
		else {

			(async () => {

				var tobject = {
					qslp1: {
						tp: 'CLONE',
						id: selectedToken,
						no: notes
					}
				};

				var vendor = JSON.stringify(tobject);

				let res = await userService.sendtransaction(walletid, null, address, 0.00000001, pass, vendor);

				if (res.status === true) {

					toast.success(res.message);

					handleReset();


				}
				else {

					toast.error(res.message);

				}
				
				setIsFormSubmitting(false);

			})();

		}

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
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.10).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
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
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.25).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
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
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.50).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
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
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.75).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
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
			var amount = tokenInfo[selectedToken].data.tokenBalance;
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['send_amount'] = amount;

		setSendForm(currentSendForm);

	};

	const handleBurnPercent10 = (e) => {

		e.preventDefault();

		try {
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.10).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['burn_amount'] = amount;

		setSendForm(currentSendForm);

	};

	const handleBurnPercent25 = (e) => {

		e.preventDefault();

		try {
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.25).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['burn_amount'] = amount;

		setSendForm(currentSendForm);

	};

	const handleBurnPercent50 = (e) => {

		e.preventDefault();

		try {
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.50).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['burn_amount'] = amount;

		setSendForm(currentSendForm);

	};

	const handleBurnPercent75 = (e) => {

		e.preventDefault();

		try {
			var amount = (tokenInfo[selectedToken].data.tokenBalance * 0.75).toFixed(tokenInfo[selectedToken].data.tokenDecimals);
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['burn_amount'] = amount;

		setSendForm(currentSendForm);

	};

	const handleBurnPercent100 = (e) => {

		e.preventDefault();

		try {
			var amount = tokenInfo[selectedToken].data.tokenBalance;
		} catch (e) {
			var amount = 0;
		}

		var currentSendForm = {};

		Object.assign(currentSendForm, sendForm);

		currentSendForm['burn_amount'] = amount;

		setSendForm(currentSendForm);

	};
	
	// Qslp1

	const doActionGetTokenInfo = (e) => {

		setTheAction('gettokeninfo');
		
		setIsFormSubmitting(false);

	};

	const doActionSend = (e) => {

		setTheAction('send');
		
		setIsFormSubmitting(false);

	};

	const doActionBurn = (e) => {

		setTheAction('burn');
		
		setIsFormSubmitting(false);

	};

	const doActionMint = (e) => {

		setTheAction('mint');
		
		setIsFormSubmitting(false);

	};

	const doActionPause = (e) => {

		setTheAction('pause');
		
		setIsFormSubmitting(false);

	};

	const doActionResume = (e) => {

		setTheAction('resume');
		
		setIsFormSubmitting(false);

	};

	const doActionNewOwner = (e) => {

		setTheAction('newowner');
		
		setIsFormSubmitting(false);

	};
	
	// Qslp2

	const doAction2GetTokenInfo = (e) => {

		setTheAction('gettoken2info');
		
		setIsFormSubmitting(false);

	};

	const doAction2Pause = (e) => {

		setTheAction('pause');
		
		setIsFormSubmitting(false);

	};

	const doAction2Resume = (e) => {

		setTheAction('resume');
		
		setIsFormSubmitting(false);

	};

	const doAction2NewOwner = (e) => {

		setTheAction('newowner');
		
		setIsFormSubmitting(false);

	};
	
	const doAction2AddMeta = (e) => {

		setTheAction('addmeta');
		
		setIsFormSubmitting(false);

	};
	
	const doAction2VoidMeta = (e) => {

		setTheAction('voidmeta');
		
		setIsFormSubmitting(false);

	};
	
	const doAction2AuthMeta = (e) => {

		setTheAction('authmeta');
		
		setIsFormSubmitting(false);

	};

	const doAction2RevokeMeta = (e) => {

		setTheAction('revokemeta');
		
		setIsFormSubmitting(false);

	};

	const doAction2Clone = (e) => {

		setTheAction('clone');
		
		setIsFormSubmitting(false);

	};
	
	const setTabQredit = (e) => {

		setTheTab('qredit');
		setTheAction(null);
		setSendForm({});
		setSelectedToken(null);

		setIsFormSubmitting(false);
		
	};

	const setTabArk = (e) => {

		setTheTab('ark');
		setTheAction(null);
		setSendForm({});
		setSelectedToken(null);

		setIsFormSubmitting(false);
		
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
								<Nav.Link eventKey="tab1" onClick={setTabQredit} className="zl_add_currency_inner_content">
									<div className="zl_add_currency_price">
										<div className="zl_add_currency_left_price">
											<h3 className="fixcolor">
												<img style={{ width: '20px', height: '20px' }} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
												&nbsp;Qredit Blockchain
											</h3>
										</div>
									</div>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item className="zl_add_currency_column col">
								<Nav.Link eventKey="tab2" onClick={setTabArk} className="zl_add_currency_inner_content">
									<div className="zl_add_currency_price">
										<div className="zl_add_currency_left_price">
											<h3 className="fixcolor">
												<img style={{ width: '20px', height: '20px' }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
												&nbsp;ARK Blockchain
											</h3>
										</div>
									</div>
								</Nav.Link>
							</Nav.Item>

						</Nav>
					</div>
					<Tab.Content className="center-center">
						<Tab.Pane eventKey="tab1">

							<div className='primary-color' style={{ textAlign: 'left' }}>
								Network: Qredit Blockchain
							</div>

							<div style={{ textAlign: 'left' }}>

								<Select
									placeholder={'Select Token...'}
									options={colorOptions2}
									styles={colorStyles2}
									isClearable={true}
									isSearchable={true}
									id="select_token"
									onChange={handleTokenSelectFormChange}
								/>

							</div>

							{selectedToken !== null ? (
								<div style={{ textAlign: 'left', marginTop: '3px', marginBottom: '3px' }}>

									
									{tokenInfo[selectedToken].info.type === 'QSLP2' ? (
									
										<>
										<button onClick={doAction2GetTokenInfo} className={"btn mr-2" + (theAction === 'gettoken2info' ? " btn-primary" : " btn-secondary")}>Token Summary</button>
										<button onClick={doAction2AddMeta} className={"btn mr-2" + (theAction === 'addmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isMetaAuth === true ? {} : { display: 'none' }}>Add Meta</button>
										<button onClick={doAction2VoidMeta} className={"btn mr-2" + (theAction === 'voidmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isMetaAuth === true ? {} : { display: 'none' }}>Void Meta</button>
										<button onClick={doAction2AuthMeta} className={"btn mr-2" + (theAction === 'authmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Auth Meta</button>
										<button onClick={doAction2RevokeMeta} className={"btn mr-2" + (theAction === 'revokemeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Revoke Meta</button>
										<button onClick={doAction2Pause} className={"btn mr-2" + (theAction === 'pause' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Pause</button>
										<button onClick={doAction2Resume} className={"btn mr-2" + (theAction === 'resume' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Resume</button>
										<button onClick={doAction2Clone} className={"btn mr-2" + (theAction === 'clone' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Clone</button>
										<button onClick={doAction2NewOwner} className={"btn mr-2" + (theAction === 'newowner' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>New Owner</button>
										</>
										
									
									) : (
									
										<>
										<button onClick={doActionGetTokenInfo} className={"btn mr-2" + (theAction === 'gettokeninfo' ? " btn-primary" : " btn-secondary")}>Token Summary</button>
										<button onClick={doActionSend} className={"btn mr-2" + (theAction === 'send' ? " btn-primary" : " btn-secondary")}>Send / Receive</button>
										<button onClick={doActionBurn} className={"btn mr-2" + (theAction === 'burn' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Burn</button>
										<button onClick={doActionMint} className={"btn mr-2" + (theAction === 'mint' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.mintable === true ? {} : { display: 'none' }}>Mint</button>
										<button onClick={doActionPause} className={"btn mr-2" + (theAction === 'pause' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Pause</button>
										<button onClick={doActionResume} className={"btn mr-2" + (theAction === 'resume' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Resume</button>
										<button onClick={doActionNewOwner} className={"btn mr-2" + (theAction === 'newowner' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>New Owner</button>
										</>
									
									)}

								</div>
								
							) : ''}

{/* Qredit actions - copy and paste this section to ark whenever making changes */}

							{theAction === 'gettokeninfo' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Token Info
													</h3>
													<div className="primary-color">
													
														Token ID: {tokenInfo[selectedToken].info.tokenDetails.tokenIdHex}  <br />

														Token Name: {tokenInfo[selectedToken].info.tokenDetails.name} <br />
														Token Ticker: {tokenInfo[selectedToken].info.tokenDetails.symbol}  <br />
														Genesis Quantity: {tokenInfo[selectedToken].info.tokenDetails.genesisQuantity}  <br />
														Genesis Date: {tokenInfo[selectedToken].info.tokenDetails.genesis_timestamp}  <br />
														Owner: {tokenInfo[selectedToken].info.tokenDetails.ownerAddress}  <br />
														Pausable: {tokenInfo[selectedToken].info.tokenDetails.pausable===true?'Yes':'No'}  <br />
														Mintable: {tokenInfo[selectedToken].info.tokenDetails.mintable===true?'Yes':'No'}  <br />
														
														Current Circulating Supply: {tokenInfo[selectedToken].info.tokenStats.qty_token_circulating_supply}  <br />
														
														My Balance: {tokenInfo[selectedToken].data.tokenBalance}  {tokenInfo[selectedToken].info.tokenDetails.symbol}<br />

													</div>
												</div>
											</div>
										</div>
									</div>

								</div>

							) : ''}

							{theAction === 'gettoken2info' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Token Summary
													</h3>
													<div className="">
														
														
														
													</div>
												</div>
											</div>
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Metadata and Document (If applicable)
													</h3>
													<div className="">
						
						
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>

							) : ''}
							
							{theAction === 'send' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Send {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
													</h3>



													<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

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

														<div style={{ width: '100%' }}>
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
																<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
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
														<h3 className="zl_send_currency_text">???0.00</h3>
														<h3 className="zl_send_currency_type">EUR</h3>
													</div>
													<div className="zl_send_currency_btn_text">
														<Button onClick={doSend} disabled={isFormSubmitting} className="zl_send_currency_btn">
															{isFormSubmitting ? 'Submitting...' : 'Send'}
														</Button>
														<div className="zl_send_currency_text">
															<p>Network Fee<span>0.02 XQR (+1 satoshi)</span></p>
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
														Receive {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
													</h3>
													<div className="zl_recive_address_content">
														<p className="zl_recive_address_heading">Address</p>
														<div className="zl_recive_copy_address_content">
															<Button onClick={(e) => doCopyAddress(e, tokenInfo[selectedToken].data.address)}>
																<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M1.48116 0H12.5365C13.3244 0 13.9653 0.641 13.9653 1.42887V4.78252H12.661V1.42887C12.661 1.36022 12.6051 1.30435 12.5365 1.30435H1.48116C1.4125 1.30435 1.35663 1.36022 1.35663 1.42887V12.4842C1.35663 12.5529 1.4125 12.6087 1.48116 12.6087H4.73024V13.9131H1.48116C0.693287 13.9131 0.0522861 13.2721 0.0522861 12.4842V1.42887C0.0523291 0.641 0.693287 0 1.48116 0Z" fill="#CAD3F2" />
																	<path d="M7.46358 6.08691H18.5188C19.3068 6.08691 19.9478 6.72791 19.9478 7.51583V18.5711C19.9477 19.3591 19.3068 20.0001 18.5188 20.0001H7.46354C6.67562 20.0001 6.03463 19.3591 6.03463 18.5712V7.51583C6.03458 6.72791 6.67567 6.08691 7.46358 6.08691ZM7.46349 18.6957H18.5188C18.5875 18.6957 18.6434 18.6398 18.6434 18.5712V7.51583C18.6434 7.44713 18.5875 7.39126 18.5188 7.39126H7.46354C7.39484 7.39126 7.33897 7.44713 7.33897 7.51583V18.5712H7.33893C7.33893 18.6398 7.39484 18.6957 7.46349 18.6957Z" fill="#CAD3F2" />
																</svg>
															</Button>
															<p>{tokenInfo[selectedToken].data.address}</p>
														</div>
														<div className="zl_recive_address_qr_code">
															<QRCode
																onClick={e => scanQR(e)}
																value={tokenInfo[selectedToken].data.address}
																bgColor={"transparent"}
																fgColor={"#CAD3F2"}
																size={166}
																className="zl_dark_theme_qrcode"
															/>
															<QRCode
																onClick={e => scanQR(e)}
																value={tokenInfo[selectedToken].data.address}
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

							) : ''}

							{theAction === 'burn' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Burn {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
														</div>
													</div>
													<FormControl
														type="number"
														placeholder="Amount to Burn"
														id="burn_amount"
														value={sendForm.burn_amount || ''}
														onChange={handleSendFormChange}
													/>
													<div className="zl_send_currency_input_btns">
														<Button onClick={handleBurnPercent10}>10%</Button>
														<Button onClick={handleBurnPercent25}>25%</Button>
														<Button onClick={handleBurnPercent50}>50%</Button>
														<Button onClick={handleBurnPercent75}>75%</Button>
														<Button onClick={handleBurnPercent100}>All</Button>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doBurn} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Burn Tokens'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'mint' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Mint {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
														</div>
													</div>
													<FormControl
														type="number"
														placeholder="Amount to Mint"
														id="mint_amount"
														value={sendForm.mint_amount || ''}
														onChange={handleSendFormChange}
													/>

												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">
													<Button onClick={doMint} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Mint New Tokens'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'pause' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Pause {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Current Status: {tokenInfo[selectedToken].info.paused === true ? "Paused" : "Active"}</span></p>
														</div>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doPause} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Pause Token'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'resume' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Resume {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Current Status: {tokenInfo[selectedToken].info.paused === true ? "Paused" : "Active"}</span></p>
														</div>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doResume} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Resume Token'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'newowner' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													New Ownership for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

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

													<div style={{ width: '100%' }}>
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

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">
													<Button onClick={doNewOwner} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Set New Ownership'}
													</Button>
												</div>


											</div>
										</div>
									</div>
								</div>

							) : ''}

{/* v2 stuff */}

							{theAction === 'authmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Auth Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

													<FormControl
														placeholder="Auth Meta Address"
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

													<div style={{ width: '100%' }}>
														<Select
															placeholder={'Select Auth Meta Contact...'}
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
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doAuthMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Auth Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'revokemeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Revoke Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

													<FormControl
														placeholder="Revoke Meta Address"
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

													<div style={{ width: '100%' }}>
														<Select
															placeholder={'Select Revoke Meta Contact...'}
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
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doRevokeMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Revoke Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}
							
							{theAction === 'clone' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Clone {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doClone} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Clone Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'addmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Add Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="number"
														placeholder="Chunk Number"
														id="send_chunk"
														default="0"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Data Name"
														id="send_dataname"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Data Value"
														id="send_datavalue"
														onChange={handleSendFormChange}
													/>
												</div>
												
												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doAddMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Add Meta to Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'voidmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Void Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Original Transaction ID"
														id="send_txid"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doVoidMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Void Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

{/* End of Qredit actions */}

						</Tab.Pane>
						<Tab.Pane eventKey="tab2">

							<div className='primary-color' style={{ textAlign: 'left' }}>
								Network: ARK Blockchain
							</div>


							<div style={{ textAlign: 'left' }}>

								<Select
									placeholder={'Select Token...'}
									options={colorOptions2}
									styles={colorStyles2}
									isClearable={true}
									isSearchable={true}
									id="select_token"
									onChange={handleTokenSelectFormChange}
								/>

							</div>



							{selectedToken !== null ? (
								<div style={{ textAlign: 'left', marginTop: '3px', marginBottom: '3px' }}>

									
									{tokenInfo[selectedToken].info.type === 'ASLP2' ? (
									
										<>
										<button onClick={doAction2GetTokenInfo} className={"btn mr-2" + (theAction === 'gettoken2info' ? " btn-primary" : " btn-secondary")}>Token Summary</button>
										<button onClick={doAction2AddMeta} className={"btn mr-2" + (theAction === 'addmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isMetaAuth === true ? {} : { display: 'none' }}>Add Meta</button>
										<button onClick={doAction2VoidMeta} className={"btn mr-2" + (theAction === 'voidmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isMetaAuth === true ? {} : { display: 'none' }}>Void Meta</button>
										<button onClick={doAction2AuthMeta} className={"btn mr-2" + (theAction === 'authmeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Auth Meta</button>
										<button onClick={doAction2RevokeMeta} className={"btn mr-2" + (theAction === 'revokemeta' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Revoke Meta</button>
										<button onClick={doAction2Pause} className={"btn mr-2" + (theAction === 'pause' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Pause</button>
										<button onClick={doAction2Resume} className={"btn mr-2" + (theAction === 'resume' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Resume</button>
										<button onClick={doAction2Clone} className={"btn mr-2" + (theAction === 'clone' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Clone</button>
										<button onClick={doAction2NewOwner} className={"btn mr-2" + (theAction === 'newowner' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>New Owner</button>
										</>
										
									
									) : (
									
										<>
										<button onClick={doActionGetTokenInfo} className={"btn mr-2" + (theAction === 'gettokeninfo' ? " btn-primary" : " btn-secondary")}>Token Summary</button>
										<button onClick={doActionSend} className={"btn mr-2" + (theAction === 'send' ? " btn-primary" : " btn-secondary")}>Send / Receive</button>
										<button onClick={doActionBurn} className={"btn mr-2" + (theAction === 'burn' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>Burn</button>
										<button onClick={doActionMint} className={"btn mr-2" + (theAction === 'mint' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.mintable === true ? {} : { display: 'none' }}>Mint</button>
										<button onClick={doActionPause} className={"btn mr-2" + (theAction === 'pause' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Pause</button>
										<button onClick={doActionResume} className={"btn mr-2" + (theAction === 'resume' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true && tokenInfo[selectedToken].info.tokenDetails.pausable === true ? {} : { display: 'none' }}>Resume</button>
										<button onClick={doActionNewOwner} className={"btn mr-2" + (theAction === 'newowner' ? " btn-primary" : " btn-secondary")} style={tokenInfo[selectedToken].data.isOwner === true ? {} : { display: 'none' }}>New Owner</button>
										</>
									
									)}

								</div>
								
							) : ''}


{/* Ark actions.  this is just a copy of the qredit stuff above... so change qredit stuff, then just copy paste same thing here */ }

							{theAction === 'gettokeninfo' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Token Info
													</h3>
													<div className="primary-color">
													
														Token ID: {tokenInfo[selectedToken].info.tokenDetails.tokenIdHex}  <br />

														Token Name: {tokenInfo[selectedToken].info.tokenDetails.name} <br />
														Token Ticker: {tokenInfo[selectedToken].info.tokenDetails.symbol}  <br />
														Genesis Quantity: {tokenInfo[selectedToken].info.tokenDetails.genesisQuantity}  <br />
														Genesis Date: {tokenInfo[selectedToken].info.tokenDetails.genesis_timestamp}  <br />
														Owner: {tokenInfo[selectedToken].info.tokenDetails.ownerAddress}  <br />
														Pausable: {tokenInfo[selectedToken].info.tokenDetails.pausable===true?'Yes':'No'}  <br />
														Mintable: {tokenInfo[selectedToken].info.tokenDetails.mintable===true?'Yes':'No'}  <br />
														
														Current Circulating Supply: {tokenInfo[selectedToken].info.tokenStats.qty_token_circulating_supply}  <br />
														
														My Balance: {tokenInfo[selectedToken].data.tokenBalance}  {tokenInfo[selectedToken].info.tokenDetails.symbol}<br />

													</div>
												</div>
											</div>
										</div>
									</div>

								</div>

							) : ''}

							{theAction === 'gettoken2info' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Token Summary
													</h3>
													<div className="">
														
														
														
													</div>
												</div>
											</div>
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														Metadata and Document (If applicable)
													</h3>
													<div className="">
						
						
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>

							) : ''}
							
							{theAction === 'send' ? (

								<div className="zl_chart_component active">
									<div className="zl_send_recive_content">
										<div className="zl_send_recive_content_row">
											<div className="zl_send_recive_content_column">
												<div className="zl_send_recive_inner_content">
													<h3 className="zl_send_recive_heading">
														<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
														</svg>
														Send {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
													</h3>



													<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

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

														<div style={{ width: '100%' }}>
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
																<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
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
														<h3 className="zl_send_currency_text">???0.00</h3>
														<h3 className="zl_send_currency_type">EUR</h3>
													</div>
													<div className="zl_send_currency_btn_text">
														<Button onClick={doSend} disabled={isFormSubmitting} className="zl_send_currency_btn">
															{isFormSubmitting ? 'Submitting...' : 'Send'}
														</Button>
														<div className="zl_send_currency_text">
															<p>Network Fee<span>0.02 XQR (+1 satoshi)</span></p>
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
														Receive {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
													</h3>
													<div className="zl_recive_address_content">
														<p className="zl_recive_address_heading">Address</p>
														<div className="zl_recive_copy_address_content">
															<Button onClick={(e) => doCopyAddress(e, tokenInfo[selectedToken].data.address)}>
																<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M1.48116 0H12.5365C13.3244 0 13.9653 0.641 13.9653 1.42887V4.78252H12.661V1.42887C12.661 1.36022 12.6051 1.30435 12.5365 1.30435H1.48116C1.4125 1.30435 1.35663 1.36022 1.35663 1.42887V12.4842C1.35663 12.5529 1.4125 12.6087 1.48116 12.6087H4.73024V13.9131H1.48116C0.693287 13.9131 0.0522861 13.2721 0.0522861 12.4842V1.42887C0.0523291 0.641 0.693287 0 1.48116 0Z" fill="#CAD3F2" />
																	<path d="M7.46358 6.08691H18.5188C19.3068 6.08691 19.9478 6.72791 19.9478 7.51583V18.5711C19.9477 19.3591 19.3068 20.0001 18.5188 20.0001H7.46354C6.67562 20.0001 6.03463 19.3591 6.03463 18.5712V7.51583C6.03458 6.72791 6.67567 6.08691 7.46358 6.08691ZM7.46349 18.6957H18.5188C18.5875 18.6957 18.6434 18.6398 18.6434 18.5712V7.51583C18.6434 7.44713 18.5875 7.39126 18.5188 7.39126H7.46354C7.39484 7.39126 7.33897 7.44713 7.33897 7.51583V18.5712H7.33893C7.33893 18.6398 7.39484 18.6957 7.46349 18.6957Z" fill="#CAD3F2" />
																</svg>
															</Button>
															<p>{tokenInfo[selectedToken].data.address}</p>
														</div>
														<div className="zl_recive_address_qr_code">
															<QRCode
																onClick={e => scanQR(e)}
																value={tokenInfo[selectedToken].data.address}
																bgColor={"transparent"}
																fgColor={"#CAD3F2"}
																size={166}
																className="zl_dark_theme_qrcode"
															/>
															<QRCode
																onClick={e => scanQR(e)}
																value={tokenInfo[selectedToken].data.address}
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

							) : ''}

							{theAction === 'burn' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Burn {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
														</div>
													</div>
													<FormControl
														type="number"
														placeholder="Amount to Burn"
														id="burn_amount"
														value={sendForm.burn_amount || ''}
														onChange={handleSendFormChange}
													/>
													<div className="zl_send_currency_input_btns">
														<Button onClick={handleBurnPercent10}>10%</Button>
														<Button onClick={handleBurnPercent25}>25%</Button>
														<Button onClick={handleBurnPercent50}>50%</Button>
														<Button onClick={handleBurnPercent75}>75%</Button>
														<Button onClick={handleBurnPercent100}>All</Button>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doBurn} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Burn Tokens'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'mint' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Mint {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Balance: {tokenInfo[selectedToken].data.tokenBalance} {tokenInfo[selectedToken].info.tokenDetails.symbol}</span></p>
														</div>
													</div>
													<FormControl
														type="number"
														placeholder="Amount to Mint"
														id="mint_amount"
														value={sendForm.mint_amount || ''}
														onChange={handleSendFormChange}
													/>

												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">
													<Button onClick={doMint} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Mint New Tokens'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'pause' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Pause {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Current Status: {tokenInfo[selectedToken].info.paused === true ? "Paused" : "Active"}</span></p>
														</div>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doPause} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Pause Token'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'resume' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Resume {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<div className="zl_send_currency_btn_text">
														<div className="zl_send_currency_text">
															<p><span>Current Status: {tokenInfo[selectedToken].info.paused === true ? "Paused" : "Active"}</span></p>
														</div>
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

												<div className="zl_send_currency_btn_text">
													<Button onClick={doResume} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Resume Token'}
													</Button>
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'newowner' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													New Ownership for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

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

													<div style={{ width: '100%' }}>
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

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">
													<Button onClick={doNewOwner} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Set New Ownership'}
													</Button>
												</div>


											</div>
										</div>
									</div>
								</div>

							) : ''}

{/* v2 stuff */}

							{theAction === 'authmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Auth Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

													<FormControl
														placeholder="Auth Meta Address"
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

													<div style={{ width: '100%' }}>
														<Select
															placeholder={'Select Auth Meta Contact...'}
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
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doAuthMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Auth Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'revokemeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Revoke Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content" style={{ borderBottom: '0px' }}>

													<FormControl
														placeholder="Revoke Meta Address"
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

													<div style={{ width: '100%' }}>
														<Select
															placeholder={'Select Revoke Meta Contact...'}
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
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doRevokeMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Revoke Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}
							
							{theAction === 'clone' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Clone {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doClone} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Clone Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'addmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Add Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="number"
														placeholder="Chunk Number"
														id="send_chunk"
														default="0"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Data Name"
														id="send_dataname"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Data Value"
														id="send_datavalue"
														onChange={handleSendFormChange}
													/>
												</div>
												
												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doAddMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Add Meta to Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}

							{theAction === 'voidmeta' ? (

								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<svg width="15" height="15" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z" fill="#53B9EA" />
													</svg>
													Void Meta for {tokenInfo[selectedToken].info.tokenDetails.name} ({tokenInfo[selectedToken].info.tokenDetails.symbol})
												</h3>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="text"
														placeholder="Original Transaction ID"
														id="send_txid"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_input_content">
													<FormControl
														type="password"
														placeholder="Your Password"
														id="send_password"
														onChange={handleSendFormChange}
													/>
												</div>

												<div className="zl_send_currency_btn_text">

													<Button onClick={doVoidMeta} disabled={isFormSubmitting} className="btn">
														{isFormSubmitting ? 'Submitting...' : 'Void Meta for Token'}
													</Button>
													
												</div>

											</div>
										</div>
									</div>
								</div>

							) : ''}
							
{/* End of Action Area (paste) */}

						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
}

export default connect(null, null)(QSLP1Module);