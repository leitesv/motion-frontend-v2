import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component";
import Select, { components } from 'react-select';
import { CSSTransition } from 'react-transition-group';
import countryList from 'react-select-country-list'

// SubItems
//import AppservicesSecurity from './AppservicesSecurity';
//import AppservicesBip from './AppservicesBip';
//import Loginhistory from './Loginhistory';
//import AppservicesPhone from './AppservicesPhone';
//import AppservicesAddress from './AppservicesAddress';
//import AppservicesNotifications from './AppservicesNotifications';
//import AppservicesTwoFactor from './AppservicesTwoFactor';


import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';



const SettingModule = ({ themHandler, props }) => {

	const countrylist = countryList().getData();

    const [state, setState] = React.useState(store.getState());

    const [currOptions, setCurrOptions] = useState([]);
    const [langOptions, setLangOptions] = useState([]);

    const [addressForm, setAddressForm] = useState({});

	const [addressList, setAddressList] = useState([]);
	const [addressInitial, setAddressInitial] = useState(true);

	const [phoneList, setPhoneList] = useState([]);
	const [phoneInitial, setPhoneInitial] = useState(true);
	
    const [defaultLang, setDefaultLang] = useState({value: 'en', label: 'English'});
    const [defaultCurr, setDefaultCurr] = useState({value: 'EUR', label: 'EUR'});

    const [passForm, setPassForm] = useState({});

    const [appItem, setAppItem] = useState(null);

    const [tfaForm, setTfaForm] = useState({});

	const [loginHistory, setLoginHistory] = useState([]);
    const [loginShownItems, setLoginShownItems] = useState(10);
    const [loginHasMore, setLoginHasMore] = useState(true);

    const [bipForm, setBipForm] = useState(null);
    const [bipHtml, setBipHtml] = useState('');


	let history = useHistory();

	const countriesList = countrylist.length > 0
		&& countrylist.map((item, i) => {
			return {value: item.value, label: item.label}
		}, this);

    React.useEffect(() => {
        // Runs after the first render() lifecycle

        (async () => {

			const currencyOptions = [
			 {value: 'EUR', label: 'EUR'},
			 {value: 'USD', label: 'USD'},
			 {value: 'AUD', label: 'AUD'},
			 {value: 'CNY', label: 'CNY'},
			 {value: 'HKD', label: 'HKD'},
			];
            
            setCurrOptions(currencyOptions);

			const languageOptions = [
			 {value: 'en', label: 'English'},
			 {value: 'zh', label: 'Chinese (Mandarin)'},
			];
            
            setLangOptions(languageOptions);
			
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

				for (let i = 0; i < currencyOptions.length; i++)
				{
					let thisitem = currencyOptions[i];
					if (thisitem.value == res.user.preferred_currency)
					{
						setDefaultCurr(thisitem);
					}
				
				}

				for (let i = 0; i < languageOptions.length; i++)
				{
					let thisitem = languageOptions[i];
					if (thisitem.value == res.user.preferred_language)
					{
						setDefaultLang(thisitem);
					}
				
				}
                    
            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                history.push('/login/');

            }

        })();


    }, []);

    const setCurrentItem = (e, item) => {

        e.preventDefault();

        if (appItem === item) {
        	setAppItem(null);
        }
        else 
        {
        	setAppItem(item);
        }

    };

    const [color, setColor] = useState(localStorage.getItem("themColor") === "false" ? false : localStorage.getItem("themColor") !== null && true);

    const handleLogOut = (event) => {

        localStorage.removeItem("accessToken");
        history.push('/login/');
        toast.success("You have been logged out");

    };

    const handleCurrencyChange = currencyAbbrev => {

		(async () => {

			let res = await userService.setcurrency(currencyAbbrev.value);

			if (res.status === true)
			{
			
				toast.success('Currency Setting Updated: ' + currencyAbbrev);
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}

		})();

    }

    const onSelectLanguage = language => {

		(async () => {

			let res = await userService.setlanguage(language.value);

			if (res.status === true)
			{
			
				toast.success('Language Setting Updated: ' + language.value);
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}

		})();

    }

	// Addresses
	
    const handleAddressFormChange = event => {

        var currentAddressForm = {};
            
        Object.assign(currentAddressForm, addressForm);
        
        currentAddressForm[event.target.id] = event.target.value;
        
        setAddressForm(currentAddressForm);

    };

    const handleAddressFormCountry = country => {

        var currentAddressForm = {};
            
        Object.assign(currentAddressForm, addressForm);
        
        currentAddressForm['country'] = country.value;
        
        setAddressForm(currentAddressForm);
        
        //setState({ addressFormCountry: {value: country.value, label: country.label} });

    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.addressFormCountry = {value: country.value, label: country.label};

        setState(currentState);
        
    }
    
    const addAddress = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.addnewaddress(addressForm);

            if (res.status === true) {

                toast.success(res.message);
                                
                setAddressForm({});

                setAddressInitial(true);

                let res2 = await userService.getuseraddresses();

                if (res2.status === true) {

					setAddressList(res2.addresslist);
                	setAddressInitial(false);

                }
                else {

	                setAddressInitial(false);

                }

            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const loadAddresses = () => {


		(async () => {

            setAddressInitial(true);

			let res = await userService.getuseraddresses();

			if (res.status === true) {

				setAddressList(res.addresslist);
                setAddressInitial(false);
                
			}
			else {

				setAddressInitial(false);

			}

		})();


    };

    const showAddAddress = () => {
    
    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.showAddNew = true;

        setState(currentState);

    };

    const hideAddAddress = () => {

    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.showAddNew = false;

        setState(currentState);
        
    };

    const setPrimaryAddress = (id) => {

        (async () => {

            let res = await userService.setprimaryaddress(id);

            if (res.status === true) {
            
                setAddressInitial(true);

                let restwo = await userService.getuseraddresses();

                if (restwo.status === true) {

					setAddressList(restwo.addresslist);
                	setAddressInitial(false);
                
                }
                else {

                    setAddressInitial(false);

                }

            }

        })();

    };
    
    // End Addresses
    
    // Phones
    
	const handlePhoneFormChange = event => {

    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.phoneForm = event.target.value;

        setState(currentState);
        		
	};

	const handlePinFormChange = event => {

    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.pinForm = event.target.value;

        setState(currentState);
        		
	};

	const getPinCode = (e) => {
	
		e.preventDefault();
		
		(async () => {
		
			let res = await userService.getpincode(state.phoneForm);
			
			if (res.status === true)
			{
			
				toast.success(res.message);				

				var currentState = {};
		
				Object.assign(currentState, state);
		
				currentState.phoneForm = res.phone;

				setState(currentState);
        
			}
			else
			{
				toast.error(res.message);
			}
		
		})();
		
	};

	const submitPinCode = (e) => {
	
		e.preventDefault();

		(async () => {
		
			let res = await userService.submitpincode(state.phoneForm, state.pinForm);
			
			if (res.status === true)
			{
				toast.success(res.message);

				var currentState = {};
		
				Object.assign(currentState, state);
		
				currentState.phoneForm = null;
				currentState.pinForm = null;

				setState(currentState);

				setPhoneInitial(true);

				let res2 = await userService.getuserphones();
			
				if (res2.status === true)
				{

					setPhoneList(res2.phonelist);
					setPhoneInitial(false);

				}
				else
				{
				
					setPhoneInitial(false);

				}
				
			}
			else
			{
				toast.error(res.message);
			}
		
		})();
		
	};

	const loadPhones = () => {

		(async () => {
		
			setPhoneInitial(true);
	
			let res = await userService.getuserphones();
		
			if (res.status === true)
			{

				setPhoneList(res.phonelist);
				setPhoneInitial(false);

			}
			else
			{
			
				setPhoneInitial(false);

			}
	
		})();

	};

	const setPrimaryPhone = (id) => {
	
        (async () => {

            let res = await userService.setprimaryphone(id);

            if (res.status === true) {
            
                setPhoneInitial(true);

                let restwo = await userService.getuserphones();

                if (restwo.status === true) {

					setPhoneList(restwo.addresslist);
                	setPhoneInitial(false);
                
                }
                else {

                    setPhoneInitial(false);

                }

            }

        })();
	
	};

	const showAddPhone = () => {
	
    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.showAddNewPhone = true;

        setState(currentState);
        	
	};

	const hideAddPhone = () => {
	
    	var currentState = {};
    	
    	Object.assign(currentState, state);
    	
    	currentState.showAddNewPhone = false;

        setState(currentState);
        	
	};
	
    // End Phones
    
    // Security / password

	const loadSecurity = () => {
	
		setPassForm({});

	};
	
	const updatePassword = (e) => {
	
		e.preventDefault();
		
		if (passForm.new_password !== passForm.confirm_password)
		{
		
			toast.error("Error:  New passwords do not match");
		
		}
		else
		{
					
			(async () => {

				let data = {
				  password: passForm.current_password,
				  newpass: passForm.new_password
				};
	
				let res = await userService.changepassword(data);

				if (res.status === true)
				{
					setPassForm({});
					toast.success(res.message);
				}
				else
				{
					toast.error(res.message);
				}

			})();
		
		}
		
	};

	const logoutAllDevices = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let res = await userService.invalidatesessions();

			if (res.status === true)
			{
			
				localStorage.removeItem("accessToken");
                toast.success(res.message);
                history.push('/login/');
				
			}
			else
			{
				toast.error(res.message);
			}

		})();		
	};

	const handlePassFormChange = event => {

    	var currentState = {};
    	
    	Object.assign(currentState, passForm);
    	
    	currentState[event.target.id] = event.target.value;

		setPassForm(currentState);
		        		
	};
	
    // End Security

    // Two Factor

	const loadTwoFactor = () => {
	
		setTfaForm({});

		(async () => {

			let res = await userService.usertwofactor();

			if (res.status === true)
			{
			
				var currentTfaForm = {};
				
				Object.assign(currentTfaForm, tfaForm);
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['qrcodedataurl'] = res.qrcodedataurl;
				
				setTfaForm(currentTfaForm);
			
			}
			else
			{
				toast.error(res.message);
			}

		})();
			
	};

	const handleTfaFormChange = event => {

    	var currentState = {};
    	
    	Object.assign(currentState, tfaForm);
    	
    	currentState[event.target.id] = event.target.value;

		setTfaForm(currentState);
		        		
	};

	const activateTwoFactor = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let data = {pincode: tfaForm.tfapin, password: tfaForm.password};

			let res = await userService.usertwofactorsave(data);
			
			if (res.status === true)
			{
		
				toast.success(res.message);
				
				let currentTfaForm = {};
				
				Object.assign(currentTfaForm, tfaForm);
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['qrcodedataurl'] = null;
				currentTfaForm['tfapin'] = '';
				
				setTfaForm(currentTfaForm);
					
			}
			else
			{
				toast.error(res.message);
				
				let currentTfaForm = {};
				
				Object.assign(currentTfaForm, tfaForm);

				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['tfapin'] = '';
				
				setTfaForm(currentTfaForm);
				
			}

		})();
		
	};

	const deactivateTwoFactor = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let data = {pincode: tfaForm.tfapin};

			let res = await userService.usertwofactordisable(data);
			
			if (res.status === true)
			{
		
				toast.success(res.message);
				
				let currentTfaForm = {};

				Object.assign(currentTfaForm, tfaForm);
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['qrcodedataurl'] = res.qrcodedataurl;
				currentTfaForm['tfapin'] = '';
				
				setTfaForm(currentTfaForm);
					
			}
			else
			{
				toast.error(res.message);
				
				let currentTfaForm = {};

				Object.assign(currentTfaForm, tfaForm);
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['tfapin'] = '';
				
				setTfaForm(currentTfaForm);

			}

		})();
		
	};
	
	// End Two Factor
	
	// Login History
	
	const parseJsonRegion = (jsonstring) => {
		let data = JSON.parse(jsonstring);
		return data.city + ', ' + data.regionName + ', ' + data.country;
	};
	
	const loginRefresh = () => {
	
		(async () => {
					
			setLoginShownItems(10);
		
			let res = await userService.getloginhistory(0, 10);

			if (res.status === true)
			{
				setLoginHistory(res.loginhistory);
				setLoginHasMore(res.hasmore);
			}
		
		})();
	};
	
	const loginFetchMoreData = () => {
	
		(async () => {
		
			var currentCount = loginShownItems
			var newCount = currentCount + 10;
			var skip = newCount - 10;
			var limit = 10;
					
			setLoginShownItems(newCount);
		
			let res = await userService.getloginhistory(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = loginHistory.concat(res.loginhistory);

				setLoginHistory(newhistory);
				setLoginHasMore(res.hasmore);

			}
		
		})();
	};
	
	// End Login History
	
	// BIP

	const loadBip = () => {
	
		setBipForm(null);
		
	};
	
	const handleBipFormChange = event => {

		setBipForm(event.target.value);
		        		
	};

	const doGetPassphrase = (e) => {

		e.preventDefault();

		(async () => {

			if (bipForm && bipForm != '')
			{
				let res = await userService.getpassphrase({password: bipForm});

				if (res.status === true)
				{

					let passphrase = res.message;

					let phrasearray = passphrase.split(' ');

					if (phrasearray.length === 12)
					{
					
						let modaldata = '';

						for (let i = 0; i < phrasearray.length; i++)
						{
							modaldata += "Word #" + (i+1) + ":  " + phrasearray[i] + "\n";
						}
						
						setBipHtml(modaldata);

					}
					else
					{

						toast.error('Error Decrypting Passphrase.  Check Password');

					}

				}
				else
				{

					toast.error(res.message);

				}
			}

		})();

	};
	
	// End Bip

	// Persona

	const loadPersona = () => {

		(async () => {

			let res = await userService.get();

			if (res.status === true) {
				setState({ user: res.user });
			}
		
		})();
                
	};

    const toggleItem = (e, item) => {
    
    	(async () => {
    	
			let defaultsettings = {
				showprofilepicture: false,
				showlinkedaddresses: false,
				showaddressiskycverified: false,
				showaddresshasthisamountofcontacts: false,
				showalternatealias: false,
				showaccountcreationdate: false,
				showkycvalidtill: false,
				showmotionplan: false,
				showmotionlastlogin: false,
				showmotionfiatvalue: false,
				showmotiontotalcryptovalue: false,
				showaddressverified: false,
				showphoneverified: false,
				showaccounttype: false,
				showemailverified: false,
				showhasfacebookconnected: false,
				showhaslinkedinconnected: false,
				showprofilecomments: false
			};
		
			let currentsettings = state.user.persona || defaultsettings;

			if (currentsettings[item] === true) {

				currentsettings[item] = false;

			}
			else 
			{

				currentsettings[item] = true;

			}

			var currentState = {};
		
			Object.assign(currentState, state);
		
			currentState.user.persona = currentsettings;

			setState(currentState);
			
            await userService.savepersonasettings(currentsettings);

            toast.success('Setting Updated');

        })();

    }
    
	// End Persona
	
    return (
        <>
            <section className="zl_settings_page">
                <HeadingModule name={'Settings'} />
                <div className="zl_setting_list">


                    <h3 className="zl_bottom_content_heading">Qredit Motion</h3>
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Currency</h3>
                            <p>Set your preferred local currency.</p>
                        </div>
                        <div className="zl_setting_items_right_text" style={{width: '280px'}}>
							<div style={{width: '100%'}}>
							<Select
								value={defaultCurr}
								options={currOptions}
								isClearable={false}
								isSearchable={true}
								id="setting_currency"
								onChange={handleCurrencyChange}
							/>
							</div>	

                        </div>
                    </div>
                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Language</h3>
                            <p>Set your preferred language</p>
                        </div>
                        
                        <div className="zl_setting_items_right_text" style={{width: '280px'}}>
							<div style={{width: '100%'}}>
							<Select
								value={defaultLang}
								options={langOptions}
								isClearable={false}
								isSearchable={true}
								id="setting_language"
								onChange={onSelectLanguage}
							/>
							</div>	

                        </div>

                    </div>
                    <Link to={'/priceplan'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Priceplan</h3>
                            <p>Modify Subscription</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <div className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Change Theme</h3>
                            <p>Enable or Disable Dark Mode</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id='checkbox2'
                            label=""
                            className="zl_custom_currency_checkbox"
                            checked={color}
                            onChange={() => {
                                setColor(!color);
                                themHandler(color);
                            }}
                        />
                    </div>
                    
					<div onClick={ e => setCurrentItem(e, 'persona') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Persona Public Settings</h3>
                            <p>Manage Persona Public Information Settings</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
					<CSSTransition in={appItem === 'persona'} timeout={500} classNames="transitionitem" onEnter={() => loadPersona()}  >

						<div className="ml-4 pt-0 px-0 mb-4" style={appItem === 'persona' ? {} : { display: 'none' }}>
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showprofilepicture === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showprofilepicture'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showprofilepicture')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showprofilepicture === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>

								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Profile Pictures</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your profile pictures</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showlinkedaddresses === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showlinkedaddresses'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showlinkedaddresses')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showlinkedaddresses === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Linked Addresses</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your motion wallet addresses</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showaddressiskycverified === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showaddressiskycverified'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showaddressiskycverified')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showaddressiskycverified === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show KYC Verification</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your account is KYC verified</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showkycvalidtill === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showkycvalidtill'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showkycvalidtill')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showkycvalidtill === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show KYC Valid Till</h3>
									<p style={{marginLeft: '-55px'}}>The public can see how long your KYC is valid till</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showaddresshasthisamountofcontacts === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showaddresshasthisamountofcontacts'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showaddresshasthisamountofcontacts')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showaddresshasthisamountofcontacts === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Contact Count</h3>
									<p style={{marginLeft: '-55px'}}>The public can see how many contacts you have</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showalternatealias === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showalternatealias'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showalternatealias')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showalternatealias === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Alternate Alias</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your alternate alias (if set)</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showaccountcreationdate === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showaccountcreationdate'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showaccountcreationdate')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showaccountcreationdate === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Account Creation Date</h3>
									<p style={{marginLeft: '-55px'}}>The public can see when your account was created</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showmotionplan === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showmotionplan'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showmotionplan')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showmotionplan === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Account Plan</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your account plan type</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showmotionlastlogin === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showmotionlastlogin'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showmotionlastlogin')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showmotionlastlogin === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Last Login Date</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your last login date</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showmotionfiatvalue === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showmotionfiatvalue'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showmotionfiatvalue')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showmotionfiatvalue === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Value of Fiat Accounts</h3>
									<p style={{marginLeft: '-55px'}}>The public can see the total value of your Fiat accounts</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showmotiontotalcryptovalue === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showmotiontotalcryptovalue'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showmotiontotalcryptovalue')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showmotiontotalcryptovalue === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Value of Crypto Accounts</h3>
									<p style={{marginLeft: '-55px'}}>The public can see the total value of your crypto accounts</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showaddressverified === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showaddressverified'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showaddressverified')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showaddressverified === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Address is Verified</h3>
									<p style={{marginLeft: '-55px'}}>The public can see if your address is verified</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showphoneverified === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showphoneverified'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showphoneverified')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showphoneverified === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Phone is Verified</h3>
									<p style={{marginLeft: '-55px'}}>The public can see if your phone is verified</p>
								</div>

							</div>

							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showemailverified === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showemailverified'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showemailverified')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showemailverified === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Email is Verified</h3>
									<p style={{marginLeft: '-55px'}}>The public can see if your email is verified</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showaccounttype === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showaccounttype'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showaccounttype')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showaccounttype === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Account Type</h3>
									<p style={{marginLeft: '-55px'}}>The public can see your account type (ie, individual/company)</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showhasfacebookconnected === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showhasfacebookconnected'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showhasfacebookconnected')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showhasfacebookconnected === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Facebook Connected</h3>
									<p style={{marginLeft: '-55px'}}>The public can see you have Facebook connected</p>
								</div>

							</div>
							
							<div className="zl_setting_list_items" style={{marginBottom: '0px', borderBottom: '1px dotted #828cae26', borderTop: '0px', borderRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showhaslinkedinconnected === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showhaslinkedinconnected'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showhaslinkedinconnected')}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showhaslinkedinconnected === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show LinkedIn Connected</h3>
									<p style={{marginLeft: '-55px'}}>The public can see you have LinkedIn connected</p>
								</div>

							</div>


							<div className="zl_setting_list_items" style={{ borderTop: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}}>
								{state.user && state.user.persona && state.user.persona.showprofilecomments === true ? (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#00ff00', display: 'inline', marginRight: '5px'}}></div>
								) : (
									<div style={{width:'20px', height:'20px', borderRadius: '10px', backgroundColor: '#ff0000', display: 'inline', marginRight: '5px'}}></div>
								)}
								<Form.Check
									type="switch"
									id='showprofilecomments'
									label=""
									className="zl_custom_currency_checkbox"
									onClick={e => toggleItem(e, 'showprofilecomments')} style={{ cursor: 'pointer' }}
									readOnly checked={(state.user && state.user.persona && state.user.persona.showprofilecomments === true ? 'checked' : '')}
									style={{marginRight: '5px'}}
								/>
								<div className="zl_setting_items_heading_peregraph">
									<h3>Show Profile Comments</h3>
									<p style={{marginLeft: '-55px'}}>The public can view comments made on your profile</p>
								</div>

							</div>

						</div>

					</CSSTransition>
                    



                    <h3 className="zl_bottom_content_heading">Personal</h3>
                    <div onClick={ e => setCurrentItem(e, 'addresses') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>My Addresses</h3>
                            <p>Change Addresses</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                        
                    </div>
                        
                        
					<CSSTransition in={appItem === 'addresses'} timeout={500} classNames="transitionitem" onEnter={() => loadAddresses()}  >

						<div className="card-body pt-0 px-0 mb-4" style={appItem === 'addresses' ? {borderRadius: '5px'} : { display: 'none' }}>

							<button className="btn btn-block btn-success rounded" onClick={e => showAddAddress(e)} style={state.showAddNew === true ? { display: 'none' } : {}}>Add New Address</button>

							<div className="card-body" style={state.showAddNew === true ? {} : { display: 'none' }}>
								<div className={"form-group float-label " + (addressForm.line1 ? 'active' : '')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="line1" onChange={handleAddressFormChange} value={addressForm.line1 || ''} />
									<label className="form-control-label">Address Line 1</label>
								</div>
								<div className={"form-group float-label " + (addressForm.line2 ? 'active' : '')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="line2" onChange={handleAddressFormChange} value={addressForm.line2 || ''} />
									<label className="form-control-label">Address Line 2</label>
								</div>
								<div className={"form-group float-label " + (addressForm.city ? 'active' : '')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="city" onChange={handleAddressFormChange} value={addressForm.city || ''} />
									<label className="form-control-label">City</label>
								</div>
								<div className={"form-group float-label " + (addressForm.province ? 'active' : '')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="province" onChange={handleAddressFormChange} value={addressForm.province || ''} />
									<label className="form-control-label">State/Province</label>
								</div>
								<div className={"form-group float-label " + (addressForm.postalcode ? 'active' : '')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="postalcode" onChange={handleAddressFormChange} value={addressForm.postalcode || ''} />
									<label className="form-control-label">Postal Code</label>
								</div>
								<div className={"form-group float-label " + (addressForm.country ? 'active' : '')}>

									<Select
										value={state.addressFormCountry}
										options={countriesList}
										isClearable={false}
										isSearchable={true}
										id="country"
										onChange={handleAddressFormCountry}
									/>
							

								
									<label className="form-control-label">Country</label>
									<button className="btn btn-block btn-success rounded" onClick={e => addAddress(e)}>Add Address</button>
									<button className="btn btn-block btn-danger rounded" onClick={e => hideAddAddress(e)} >Cancel</button>

								</div>
							</div>


							<div className="card-header pb-0">
								<h6 className="mb-0">Your Addresses</h6>
								<div className="hr-thin"></div>
							</div>
							<ul className="list-group list-group-flush">

								<InfiniteScroll
									dataLength={addressList.length}
									hasMore={false}
									loader={
										<p style={{ textAlign: "center" }}>
											<b>Loading...</b>
										</p>
									}
									endMessage={
										addressInitial === true ? (
											<p style={{ textAlign: "center" }}>
												<b>Loading...</b>
											</p>
										) : (
											<p style={{ textAlign: "center" }}>
												<b>No More Records</b>
											</p>
										)
									}
								>

									{addressList.map((addressitem, index) => (

										<li key={index} className="list-group-item">
											<div>
												{addressitem.line1}<br />
												{addressitem.line2}<br />
												{addressitem.city} {addressitem.province} {addressitem.postalcode}<br />
												{addressitem.country}&nbsp;&nbsp;&nbsp;{addressitem.isprimary === true ? (<span style={{ color: 'green' }}>Primary</span>) : (<span onClick={setPrimaryAddress(addressitem._id)}>Set Primary</span>)}
											</div>
											<div className="hr-thin"></div>
										</li>

									))}

								</InfiniteScroll>

							</ul>

						</div>

					</CSSTransition>




                    <div onClick={ e => setCurrentItem(e, 'phones') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>My Phone Numbers</h3>
                            <p>Manage Phone Numbers</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
					<CSSTransition in={appItem === 'phones'} timeout={500} classNames="transitionitem" onEnter={() => loadPhones()} >


						<div className="card-body pt-0 px-0 mb-4" style={appItem === 'phones'?{borderRadius: '5px'}:{display:'none'}}>
				
							<button className="btn btn-block btn-success rounded" onClick={ e => showAddPhone(e) } style={state.showAddNewPhone===true?{display:'none'}:{}}>Add New Phone</button>

				
							<div className="card-body" style={state.showAddNewPhone===true?{}:{display:'none'}}>
								<div className={"form-group float-label " + (state.phoneForm?'active':'')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="phone" onChange={handlePhoneFormChange} value={state.phoneForm || ''}/>
									<label className="form-control-label">Add Phone</label>
									<button className="btn btn-block btn-success rounded" disabled={!state.phoneForm} onClick={ e => getPinCode(e) }>Get Pin Code</button>
								</div>
								<div className={"form-group float-label " + (state.pinForm?'active':'')}>
									<input type="text" className={"form-control"} autoComplete="new-password" id="pin" onChange={handlePinFormChange} value={state.pinForm || ''}/>
									<label className="form-control-label">Enter Pin</label>
									<button className="btn btn-block btn-success rounded" disabled={!state.pinForm} onClick={ e => submitPinCode(e) }>Submit Pin Code</button>
									<button className="btn btn-block btn-danger rounded" onClick={ e => hideAddPhone(e) } >Cancel</button>
								</div>
							</div>
					

							<div className="card-header pb-0">
								<h6 className="mb-0">Your Phones</h6>
								<div className="hr-thin"></div>
							</div>
							<ul className="list-group list-group-flush">
					
								<InfiniteScroll
									dataLength={phoneList.length}
									hasMore={false}
									loader={
										<p style={{ textAlign: "center" }}>
										  <b>Loading...</b>
										</p>
									}
									endMessage={
										phoneInitial === true?(
										<p style={{ textAlign: "center" }}>
										  <b>Loading...</b>
										</p>
										):(
										<p style={{ textAlign: "center" }}>
										  <b>No More Records</b>
										</p>
										)
									}
								>
					
								{phoneList.map((phoneitem, index) => (
						
									<li className="list-group-item">
										<div key={index}>
											{phoneitem.phone} ({phoneitem.country}) - <span style={{color: 'green'}}>Verified</span> {phoneitem.isprimary === true?(<span style={{color: 'green'}}>Primary</span>):(<span onClick={this.setPrimary(phoneitem._id)}>Set Primary</span>)}
										</div>

										<div className="hr-thin"></div>
									</li>
							
								))}
						
								</InfiniteScroll>

							</ul>
					
						</div>

					</CSSTransition>
					

                    <h3 className="zl_bottom_content_heading">Advanced Features</h3>
                    <Link to={'/swapoldxqr'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Swap Old XQR</h3>
                            <p>Swap your old XQR coins</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <h3 className="zl_bottom_content_heading">About</h3>
                    <Link to={'/privacypolicy'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Privacy Policy</h3>
                            <p>View Privacy Policy</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <Link to={'/termsandconditions'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Terms and Conditions</h3>
                            <p>View Terms and Conditions</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>

                    <h3 className="zl_bottom_content_heading">Security</h3>
                    
                    <div onClick={ e => setCurrentItem(e, 'security') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>

                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Security Settings</h3>
                            <p>Password and Devices</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    
                    </div>
					<CSSTransition in={appItem === 'security'} timeout={500} classNames="transitionitem" onEnter={() => loadSecurity(true)} >

						<div className="card mb-4" style={appItem === 'security'?{}:{display:'none'}}>
							<div className="card-header">
								<h5 style={{color: '#000'}} className="mb-1">Change Password</h5>
							</div>
							<div className="card-body">
								<div className="form-group float-label">
									<input type="password" className={"form-control " + (passForm.current_password?'active':'')} autoComplete="new-password" id="current_password" onChange={handlePassFormChange} value={passForm.current_password || ''}/>
									<label className="form-control-label">Current Password</label>
								</div>
								<div className="form-group float-label">
									<input type="password" className={"form-control " + (passForm.current_password?'active':'')} autoComplete="new-password" id="new_password" onChange={handlePassFormChange} value={passForm.new_password || ''}/>
									<label className="form-control-label">New Password</label>
								</div>
								<div className="form-group float-label">
									<input type="password" className={"form-control " + (passForm.current_password?'active':'')} autoComplete="new-password" id="confirm_password" onChange={handlePassFormChange} value={passForm.confirm_password || ''}/>
									<label className="form-control-label">Confirm New Password</label>
								</div>
							</div>
							<div className="card-footer">
								<button className="btn btn-block btn-success rounded" onClick={ e => updatePassword(e) }>Update Password</button>
								<p className="text-center text-secondary mb-3">Changing password requires decryption and re-encryption of your BIP39 passphrase.  Please ensure you have stored your passphrase in a secure location prior to this action.</p>
<hr />
								<p className="text-center text-secondary mb-0 mt-3">X devices and Apps runing on this account. We suggest to logout
									from any other devices to avoid unrevokable situations.</p>
								<button className="btn btn-block btn-danger rounded mb-3" onClick={ e => logoutAllDevices(e) }>Logout from all devices</button>

							
							</div>


						</div>
				
					</CSSTransition>
                    
                    <div onClick={ e => setCurrentItem(e, 'twofactor') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Two Factor Authentication</h3>
                            <p>Enable or Disable</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>

					<CSSTransition in={appItem === 'twofactor'} timeout={500} classNames="transitionitem" onEnter={() => loadTwoFactor(true)}>

						<div className="card mb-4" style={appItem === 'twofactor'?{}:{display:'none'}}>
							<div className="card-header">
								<h5 style={{color: '#000'}} className="mb-1">
									Two Factor Authentication is {tfaForm.twofactorstatus===true?'Active':'Inactive'}
								</h5>
							</div>
							<div className="card-body" style={tfaForm.twofactorstatus!==true && tfaForm.twofactorstatus!==false?{display: 'none'}:{}}>
						
								{(tfaForm.qrcodedataurl)?(
									<div>
									<div>
									<img style={{width: '150px', height: '150px'}} src={tfaForm.qrcodedataurl} />
									<br />
									Scan barcode with your authenticator app and enter the displayed PIN code to activate.
									</div>

									<div className="form-group float-label">
										<input type="password" className={"form-control " + (tfaForm.password?'active':'')} autoComplete="off" id="password" onChange={handleTfaFormChange} value={tfaForm.password}/>
										<label className="form-control-label">Password</label>
									</div>
									</div>
								):(<div>Enter your authenticator PIN Code to disable Two Factor</div>)}
						
								<div className="form-group float-label">
									<input type="text" className={"form-control " + (tfaForm.tfapin?'active':'')} autoComplete="off" id="tfapin" onChange={handleTfaFormChange} value={tfaForm.tfapin}/>
									<label className="form-control-label">Two Factor Pin</label>
								</div>
						
							</div>
							<div className="card-footer">

								{tfaForm.twofactorstatus===false?(
						
									<button className="btn btn-block btn-success rounded" onClick={ e => activateTwoFactor(e) }>Activate</button>

								):(
						
									<button className="btn btn-block btn-danger rounded mt-3" onClick={ e => deactivateTwoFactor(e) }>Deactivate</button>
							
								)}
							
							</div>


						</div>
				
					</CSSTransition>


                    <div onClick={ e => setCurrentItem(e, 'loginhistory') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>

                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Login History</h3>
                            <p>Account Login History</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
					<CSSTransition in={appItem === 'loginhistory'} timeout={500} classNames="transitionitem" onEnter={() => loginRefresh(true)}>

						<div className="card mt-2" style={appItem === 'loginhistory'?{}:{display:'none'}}>
							<div className="card-header">
								<h5 style={{color: '#000'}} className="mb-1">
									Recent Logins
								</h5>
							</div>
							<div className="card-body px-0 pt-0">
								<div className="list-group list-group-flush border-top border-color">


									<InfiniteScroll
										dataLength={loginHistory.length}
										next={loginFetchMoreData}
										hasMore={loginHasMore}
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
										{loginHistory.map((historyitem, index) => (
							
										<li key={index} className="list-group-item border-color">
											<div className="row">
												<div className="col">
													<div className="row mb-0">
														<div className="col mb-0">
															<p className="mb-0">{historyitem.ip_address}</p>
														</div>
														<div className="col-auto pl-0 mb-0">
															<p className="small text-secondary mb-0">{historyitem.created_date}</p>
														</div>
													</div>
													<div className="row mb-0">
														<div className="col mb-0">
															<p className="small text-secondary mb-0" style={{marginBottom:'0px',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{parseJsonRegion(historyitem.ip_region)}</p>
														</div>
														<div className="col-auto pl-0 mb-0">
															<p className="small mb-0" style={(historyitem.invalidated===true?{color:'red'}:{color:'green'})}>{(historyitem.invalidated===true?'Expired':'Active')}</p>
														</div>
													</div>
													<p className="small text-secondary mb-0" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{historyitem.useragent}</p>
												</div>
											</div>
										</li>
							
										))}
									</InfiniteScroll>


								</div>
							</div>
						</div>
				
					</CSSTransition>
                
                    <div onClick={ e => setCurrentItem(e, 'bip') } className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Get BIP39 Passphrase</h3>
                            <p>Unlock & View Passphrase</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>
					<CSSTransition in={appItem === 'bip'} timeout={500} classNames="transitionitem" onEnter={() => loadBip(true)} >

						<div className="card text-left mt-2" style={appItem === 'bip'?{}:{display:'none'}}>
							<div className="card-header">
								<h5 style={{color: '#000'}} className="mb-1">Unlock and View BIP39 Passphrase</h5>
							</div>

							<div className="card-body ">
								By design, Qredit Motion <strong>DOES NOT</strong> have access to your ecrypted private keys stored on our system.  All keys are strongly encrypted using your login password.  We only store a Bcrypt hash of your password, which means we can not decrypt your keys without you providing the decryption password.  If you lose your login credentials, the <strong>ONLY</strong> way to restore access to your account is using your BIP39 passphrase.  Therefore, you should <strong>WRITE DOWN AND SAFELY STORE</strong> your passphrase before doing any activity on Qredit Motion.
								<br /><br />

								<div className="input-group mb-3">
									<input onChange={handleBipFormChange} type="password" autoComplete="new-password" className="form-control" placeholder="Password" aria-label="Password" value={bipForm} />
									<div className="input-group-append">
										<button onClick={ e => doGetPassphrase(e) } className="btn btn-success" type="button">Get Phrase</button>
									</div>
								</div>
					
								<pre>
								
									{bipHtml}
								
								</pre>
					
							</div>
						</div>
				
					</CSSTransition>
                    
                    
                    <Link to={'/accountsupport'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3 style={{ color: 'red' }}>Close Account</h3>
                            <p>Close your Account</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <div onClick={handleLogOut} className="zl_setting_list_items" style={{cursor: 'pointer'}}>
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Logout</h3>
                            <p>Logout from the application</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

export default connect(null, null)(SettingModule);
