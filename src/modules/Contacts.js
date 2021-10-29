import React, { useState } from "react";
import { connect } from "react-redux";
import { Tab, Nav } from 'react-bootstrap';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import "react-datepicker/dist/react-datepicker.css";
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ImageUploader from 'react-images-upload';
import Loader from "react-loader-spinner";

import copy from "copy-to-clipboard";
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';
import InfiniteScroll from "react-infinite-scroll-component";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import QRCode from "react-qr-code";
import { Modal, Button } from 'react-bootstrap';
import parse from "html-react-parser";


// import { mapStateToProps } from './mappers';

const ContactsModule = (props) => {

    const [state, setState] = React.useState(store.getState());

    const [contactsItem, setContactsItem] = useState(null);

    const [isFetching, setIsFetching] = useState(false);
    const [shownItems, setShownItems] = useState(20);
    const [contactList, setContactList] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    const [pIsFetching, setPIsFetching] = useState(false);
    const [pShownItems, setPShownItems] = useState(20);
    const [pendingContactList, setPendingContactList] = useState([]);
    const [pHasMore, setPHasMore] = useState(false);

    const [modalType, setModalType] = useState('');

    const [showFinder, setShowFinder] = useState(false);
    const [inviteContactValue, setInviteContactValue] = useState(null);

    const [searchEmail, setSearchEmail] = useState(false);
    const [foundContact, setFoundContact] = useState([]);

    const [modalData, setModalData] = useState(null);
    const [modalButton, setModalButton] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalCode, setModalCode] = useState(null);;
    const [showModal, setShowModal] = useState(false);
    const [modalButtonClick, setModalButtonClick] = useState(false);

    const [backgroundImage, setBackgroundImage] = useState('url(https://unifiedapi.qredit.cloud/api/backgroundimage/)');
    const [profileImage, setProfileImage] = useState('url(https://unifiedapi.qredit.cloud/api/profileimage/)');

    const [showUploadPic, setShowUploadPic] = useState(false);
    const [showUploadBG, setShowUploadBG] = useState(false);

    const [uploadingPic, setUploadingPic] = useState(false);
    const [uploadingBG, setUploadingBG] = useState(false);


    React.useEffect(() => {
        // Runs after the first render() lifecycle

		if (state.userImages && state.userImages.profilebg)
		{
			setBackgroundImage('url(' + state.userImages.profilebg + ')');
		}
		
		if (state.userImages && state.userImages.profilepic)
		{
			setProfileImage('url(' + state.userImages.profilepic + ')');
		}

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
                store.dispatch(updateStore({ key: 'user', value: res.user }));
                setState(store.getState());

                if (!state.userImages || !state.userImages.userid) {

                    let resi = await userService.getimages();

                    if (resi.status === true) {
                    
                        store.dispatch(updateStore({ key: 'userImages', value: resi.userimages }));
                        
						if (resi.userimages && resi.userimages.profilebg)
						{
							setBackgroundImage('url(' + resi.userimages.profilebg + ')');
						}
	
						if (resi.userimages && resi.userimages.profilepic)
						{
							setProfileImage('url(' + resi.userimages.profilepic + ')');
						}
                        
                    }

                }

            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }


			
        })();


    }, []);





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


    const doCopyThis = (e, crypto_balance) => {

        e.preventDefault();

        copy(crypto_balance);

        toast.success('Transaction ID Copied to Clipboard');

    };

    const refresh = () => {

        (async () => {

            setIsFetching(true);
            setShownItems(20);

            let res = await userService.getcontacts(0, 20);

            if (res.status === true) {
                setContactList(res.contactlist);
                setHasMore(res.hashmore);
            }

            setIsFetching(false);

        })();
    };

    const prefresh = () => {

        (async () => {

            setPIsFetching(true);
            setPShownItems(20);

            let res = await userService.getpendingcontacts(0, 20);

            if (res.status === true) {
                setPendingContactList(res.contactlist);
                setPHasMore(res.hasmore);
            }

            setPIsFetching(false);

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            setShownItems(newCount);

            let res = await userService.getcontacts(skip, limit);

            if (res.status === true) {

                let newcontactlist = contactList.concat(res.contactlist);
                setContactList(newcontactlist);
                setHasMore(res.hashmore);

            }

        })();
    };

    const pfetchMoreData = () => {

        (async () => {

            var currentCount = state.pshownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            setPShownItems(newCount);

            let res = await userService.getpendingcontacts(skip, limit);

            if (res.status === true) {

                let newpcontactlist = pendingContactList.concat(res.contactlist);

                setPendingContactList(newpcontactlist);
                setPHasMore(res.hasmore);


            }

        })();
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

                                let res = await userService.newcontact(result.text);

                                if (res.status === true) {

                                    toast.success(res.message);
                                    prefresh();

                                }
                                else {

                                    toast.error(res.message);

                                }

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

    const toggleFinder = (e) => {

        e.preventDefault();

        if (showFinder === true) {

            setShowFinder(false);

        }
        else {

            setShowFinder(true);

        }

    };

    const handleInviteFormChange = event => {

        setInviteContactValue(event.target.value);

    };

    const inviteContact = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.createinvitation(inviteContactValue);

            if (res.status === true) {
                toast.success(res.message);
            }
            else {
                toast.error(res.message);
            }

        })();

    }

    const handleEmailFormChange = event => {

        setSearchEmail(event.target.value);

    };

    const findContact = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.findcontact(searchEmail);

            if (res.status === true) {

                setFoundContact([res.foundcontact]);

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const addContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.newcontact(id);

            if (res.status === true) {

                toast.success(res.message);

                setFoundContact([]);
                prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const approveContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.approvecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                prefresh();
                refresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const declineContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.declinecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    const viewContact = (e, id) => {

        e.preventDefault();

        props.history.push('/viewcontact?contact=' + id);

    }

    const setCurrentItem = (e, item) => {

        e.preventDefault();

        if (contactsItem === item) {
            setContactsItem(null);
        }
        else {

            setContactsItem(item);

            if (item === 'viewpending') {

                prefresh();

            }

            if (item === 'viewcontacts') {

                refresh();

            }

        }


    };


    const onDrop = (pictureFiles, pictureDataURLs) => {
    
    	if (pictureDataURLs.length === 0)
    	{
			toast.error('Image Upload Unsuccessful.');
    	}
    	else
    	{

			setUploadingPic(false);

			(async () => {

				let data = pictureDataURLs[0];

console.log(data);

				let res = await userService.updateprofilepic(data);

				setUploadingPic(false);

				if (res.status === true)
				{

					store.dispatch( updateStore({ key: 'userImages', value: res.userimages }) );
					
					setShowUploadPic(false);
					
					toast.success(res.message);

				}
				else
				{
					toast.error(res.message);
				}

			})();
    	
    	}
    	
    }
    
    const onDropBG = (pictureFiles, pictureDataURLs) => {
    	if (pictureDataURLs.length === 0)
    	{
			toast.error('Image Upload Unsuccessful.');
    	}
    	else
    	{
			
			setUploadingBG(true);
			
			(async () => {

				let data = pictureDataURLs[0];

				let res = await userService.updateprofilebg(data);
				
				setUploadingBG(false);
			
				if (res.status === true)
				{

					store.dispatch( updateStore({ key: 'userImages', value: res.userimages }) );
					
					setShowUploadBG(false);

					toast.success(res.message);

				}
				else
				{

					toast.error(res.message);
					
				}

			})();
			
    	}

    }    
    
    
    return (
        <>

            <section className="zl_settings_page">
                <HeadingModule name={'Contacts'} />
                <div className="zl_setting_list">


				
				<div className="container-fluid px-0">
					<div className="card overflow-hidden" style={{background: 'transparent', maxWidth: '1140px', margin: 'auto'}}>
						<div className="card-body p-0" style={{height:'150px'}}>
							<div className="background text-center" style={((showUploadBG===true||uploadingBG===true)?{backgroundColor: 'rgba(255,255,255,0.35)'}:{backgroundImage: backgroundImage})} onMouseEnter={() => setShowUploadBG(true)} onMouseLeave={() => setShowUploadBG(false)}>
								<ImageUploader
									fileContainerStyle={{boxShadow: 'none', background: 'transparent', display: (showUploadBG===true&&uploadingBG!==true?'inline':'none')}}
									withIcon={false}
									withLabel={false}
									singleImage={true}
									buttonText={<img style={{height:'30px', width: '30px;'}} src="data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cloud-upload-alt' class='svg-inline--fa fa-cloud-upload-alt fa-w-20' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath fill='white' d='M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z'%3E%3C/path%3E%3C/svg%3E" />}
									buttonClassName={'btn btn-small'}
									onChange={onDropBG}
									errorStyle={{display: 'none'}}
								/>
								<Loader
									type="Puff"
									color="#FFFFFF"
									visible={uploadingBG === true? true : false}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid text-center mb-4">
					<div className="avatar rounded-circle mx-auto shadow" style={{height: '140px', width: '140px', marginTop: '-50px'}}>
						<div className="background" style={((showUploadPic===true||uploadingPic===true)?{backgroundColor: 'rgba(255,255,255,0.35)'}:{backgroundImage: profileImage})} onMouseEnter={() => setShowUploadPic(true)} onMouseLeave={() => setShowUploadPic(false)}>
							<ImageUploader
								fileContainerStyle={{boxShadow: 'none', background: 'transparent', display: (showUploadPic===true&&uploadingPic!==true?'inline':'none')}}
								withIcon={false}
								withLabel={false}
								singleImage={true}
								buttonText={<img style={{height:'30px', width: '30px;'}} src="data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cloud-upload-alt' class='svg-inline--fa fa-cloud-upload-alt fa-w-20' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath fill='white' d='M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z'%3E%3C/path%3E%3C/svg%3E" />}
								buttonClassName={'btn btn-small'}
								onChange={onDrop}
								errorStyle={{display: 'none'}}
							/>
							<Loader
								type="Puff"
								color="#FFFFFF"
								visible={uploadingPic === true? true : false}
							/>
						</div>
					</div>
				</div>

				<div className="container mb-4 text-center primary-color">
					<h6 className="mb-1">{state.user?state.user.givenname:''} {state.user?state.user.familyname:''}</h6>
					<p>{state.user?state.user.residence_country:''}</p>
					<p className="mb-1"><strong>UserID:</strong> QM Z 00 0000 0000</p>
					<p className="mb-1">{state.user?state.user.email:''}</p>
					<p className="mb-1">{state.user?state.user.phone_number:''}</p>
					
				</div>

                    <h3 className="zl_bottom_content_heading">Manage your contacts</h3>



                    <Link onClick={e => setCurrentItem(e, 'viewcontacts')} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>View Contacts</h3>
                            <p>View current contacts</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>

                    </Link>
                    <div className="card-body px-0 pt-0" style={(contactsItem === 'viewcontacts' ? { background: '#ddd', marginTop: '-20px', borderRadius: '5px' } : { display: 'none' })}>

                        <div className="input-group pl-1 pr-1">
                            <input type="text" className="form-control" placeholder="Search Contacts" />
                            <div className="input-group-append">
                                <button className="btn btn-default rounded" type="button" id="button-addon2">Search</button>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">

                            <InfiniteScroll
                                dataLength={contactList ? contactList.length : 0}
                                next={fetchMoreData}
                                hasMore={hasMore || false}
                                loader={
                                    <p style={{ textAlign: "center" }}>
                                        <b>Loading...</b>
                                    </p>
                                }
                                height={400}
                                endMessage={
                                    isFetching === true ? (
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
                                {contactList.map((contactitem, index) => (

                                    <li key={index} className="list-group-item" onClick={e => viewContact(e, contactitem._id)} style={{ cursor: 'pointer' }}>
                                        <div className="row align-items-center">
                                            <div className="col-auto pr-0">
                                                <div className="avatar avatar-40 rounded">
                                                    <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (state.user._id === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col align-self-center pr-0">
                                                <h6 className="font-weight-normal mb-1">{(state.user._id === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(state.user._id === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                <p className="small text-secondary">{(state.user._id === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                            </div>
                                            <div className="col-auto">
                                                <div className="avatar avatar-40 text-default">
                                                    <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/045-eye.svg")' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </InfiniteScroll>
                        </ul>
                    </div>



                    <Link onClick={e => setCurrentItem(e, 'viewqr')} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Your Contact QR</h3>
                            <p>Show your contact QR</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <div className="row align-items-center" style={(contactsItem === 'viewqr' ? { background: '#ddd', marginTop: '-20px', borderRadius: '5px' } : { display: 'none' })}>
                        <div className="hr-thin mb-2"></div>
                        <div className="col-auto" style={{ margin: 'auto', marginTop: '20px', marginBottom: '20px' }}><QRCode value={state.user._id || ''} /></div>
                        <div className="hr-thin mt-2"></div>
                    </div>



                    <Link onClick={e => scanQR(e)} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Scan New Contact QR</h3>
                            <p>Add a contact by their QR</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>



                    <Link onClick={e => setCurrentItem(e, 'findcontact')} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Search Contacts</h3>
                            <p>Find by phone or email</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <div className="card-body px-0 pt-0" style={(contactsItem === 'findcontact' ? { background: '#ddd', marginTop: '-20px', borderRadius: '5px' } : { display: 'none' })}>
                        <div className="hr-thin mt-2 mb-2"></div>
                        <div className="input-group col-auto pl-1 pr-1">
                            <input type="text" className="form-control" placeholder="Email/Phone" onChange={handleEmailFormChange} />
                            <div className="col-auto button" onClick={e => findContact(e)}>
                                <span className="btn">Search</span>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">

                            {foundContact.map((contactitem, index) => (

                                <li key={index} className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col-auto pr-0">
                                            <div className="avatar avatar-40 rounded">
                                                <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + contactitem._id + ')' }}>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col align-self-center pr-0">
                                            <h6 className="font-weight-normal mb-1">{contactitem.givenname} {contactitem.familyname}</h6>
                                            <p className="small text-secondary">{contactitem.email}</p>
                                        </div>
                                        <div className="col-auto">
                                            <span onClick={e => addContact(e, contactitem._id)} className="btn">Add</span>
                                        </div>
                                    </div>
                                </li>

                            ))}
                        </ul>
                        <div className="hr-thin mt-2 mb-2"></div>
                    </div>



                    <Link onClick={e => setCurrentItem(e, 'invitecontact')} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Invite</h3>
                            <p>Invite new contacts</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <div className="card-body px-0 pt-0" style={(contactsItem === 'invitecontact' ? { background: '#ddd', marginTop: '-20px', borderRadius: '5px' } : { display: 'none' })}>
                        <div className="hr-thin mt-2 mb-2"></div>
                        <div className="input-group col-auto pl-1 pr-1">
                            <input type="text" className="form-control" placeholder="Email/Phone" onChange={handleInviteFormChange} />
                            <div className="col-auto button">
                                <span onClick={e => inviteContact(e)} className="btn">Send Invite</span>
                            </div>
                        </div>
                        <div className="hr-thin mt-2 mb-2"></div>
                    </div>



                    <Link to={'/referralprogram'} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>Referral Program</h3>
                            <p>Referral program</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>



                    <Link onClick={e => setCurrentItem(e, 'viewpending')} className="zl_setting_list_items">
                        <div className="zl_setting_items_heading_peregraph">
                            <h3>View Pending Requests</h3>
                            <p>Accept/Deny pending contact requests</p>
                        </div>
                        <div className="zl_setting_items_right_text">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6.08833 6L1 11" stroke="#828CAE" strokeWidth="2.4" />
                            </svg>
                        </div>
                    </Link>
                    <div className="card-body px-0 pt-0" style={(contactsItem === 'viewpending' ? { background: '#ddd', marginTop: '-20px', borderRadius: '5px' } : { display: 'none' })}>

                        <ul className="list-group list-group-flush">

                            <InfiniteScroll
                                dataLength={pendingContactList.length}
                                next={pfetchMoreData}
                                hasMore={pHasMore || false}
                                loader={
                                    <p style={{ textAlign: "center" }}>
                                        <b>Loading...</b>
                                    </p>
                                }
                                height={200}
                                endMessage={
                                    pIsFetching === true ? (
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
                                <div className="hr-thin"></div>
                                {pendingContactList.map((contactitem, index) => (

                                    <li key={index} className="list-group-item">
                                        <div className="row align-items-center">
                                            <div className="col-auto pr-0">
                                                <div className="avatar avatar-40 rounded">
                                                    <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (state.user._id === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col align-self-center pr-0">
                                                <h6 className="font-weight-normal mb-1">{(state.user._id === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(state.userid === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                <p className="small text-secondary">{(state.user._id === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                            </div>
                                            <div className="col-auto mt-2 mb-2">
                                                {(state.user._id === contactitem.userid_b._id ? <><button onClick={e => approveContact(e, contactitem._id)} className="btn btn-sm btn-success rounded mr-1" type="button" id="button-addon2">Approve</button><button onClick={e => declineContact(e, contactitem._id)} className="btn btn-sm btn-danger rounded" type="button" id="button-addon2">Decline</button></> : 'Pending')}
                                            </div>
                                            <div className="hr-thin"></div>
                                        </div>
                                    </li>

                                ))}
                            </InfiniteScroll>
                        </ul>
                    </div>


                </div>
            </section>

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

export default connect(null, null)(ContactsModule);
