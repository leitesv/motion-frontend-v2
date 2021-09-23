import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import {useLocation} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Table } from 'react-bootstrap';
import { Tab, Nav } from 'react-bootstrap';

import store from "../store/index";
import { updateStore } from "../store/actions/index";

// SERVICES
import userService from '../services/userService';

const ViewContactModule = ({ props }) => {

    const [state, setState] = React.useState(store.getState());

  	const search = useLocation().search;
  	const contact = new URLSearchParams(search).get('contact');

    const [contactId, setContactId] = useState(contact);

    const [contactHistory, setContactHistory] = useState([]);

    const [contactInfo, setContactInfo] = useState({
    	id: '',
    	familyname: '',
    	givenname: '',
    	country: '',
    	email: '',
    	phone: ''
    });

    const [shownItems, setShownItems] = useState(0);
    const [hasMore, setHasMore] = useState(false);


    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
            	store.dispatch( updateStore({ key: 'user', value: res.user }) );
                setState(store.getState());
            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

			let cres = await userService.getcontact(contactId);

			if (cres.status === true)
			{
			
				var contactdata = {};
			
				if (cres.contact.userid_a._id == res.user._id)
				{
				
					contactdata = {
						id: cres.contact.userid_b._id,
						familyname: cres.contact.userid_b.familyname,
						givenname: cres.contact.userid_b.givenname,
						country: cres.contact.userid_b.residence_country,
						email: cres.contact.userid_b.email,
						phone: cres.contact.userid_b.phone_number
					};
				
				}
				else
				{
				
					contactdata = {
						id: cres.contact.userid_a._id,
						familyname: cres.contact.userid_a.familyname,
						givenname: cres.contact.userid_a.givenname,
						country: cres.contact.userid_a.residence_country,
						email: cres.contact.userid_a.email,
						phone: cres.contact.userid_a.phone_number
					};
				
				}
			
				setContactInfo(contactdata);
				
				
				

				

			}
			else
			{
			
				toast.error(cres.message);
				props.history.push('/contacts');
				
			}
			
        })();

    }, []);


    const refresh = () => {

        (async () => {
            
            setShownItems(10);

            //let res = await userService.getcontacthistory(contactId, 0, 10);

            //if (res.status === true)
            //{
            //	setContactHistory(newhistory);
            //	setHasMore(res.hasmore);
            //}

        })();
    };
    
    const fetchMoreData = () => {

        (async () => {

            var currentCount = shownItems;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;
            
            setShownItems(newCount);

            //let res = await userService.getcontacthistory(contactId, skip, limit);

            //if (res.status === true)
            //{

            //	let newhistory = contactHistory.concat(res.contacthistory);

            //	setContactHistory(newhistory);
            //	setHasMore(res.hasmore);
            //}

        })();
    };
    
	let backgroundImage = 'url(api/backgroundimage/' + contactInfo.id + ')';

	let profileImage = 'url(api/profileimage/' + contactInfo.id + ')';
			
    return (
        <section className="placeholder">
            <HeadingModule name={'View Contact'} />
            <div className="zl_SecureBackup_heading">
                
                
				<div className="container-fluid px-0">
					<div className="card overflow-hidden" style={{ background: 'transparent', maxWidth: '1140px', margin: 'auto' }}>
						<div className="card-body" style={{padding: '0px', height: '150px'}}>
							<div className="background text-center" style={{ backgroundImage: backgroundImage }} >

							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid text-center mb-4" style={{marginTop: '-70px'}}>
					<div className="avatar rounded-circle mx-auto shadow" style={{height: '140px', lineHeight: '140px', width: '140px'}}>
						<div className="background" style={{ backgroundImage: profileImage }} >

						</div>
					</div>
				</div>

				<div className="container mb-4 text-center text-white">
					<h6 className="mb-1">{contactInfo.givenname} {contactInfo.familyname}</h6>
					<p>{contactInfo.country}</p>
					<p className="mb-1">{contactInfo.email}</p>
					<p>{contactInfo.phone}</p>
				</div>
                
                
            </div>
            
        	<h6 className="mb-0 text-white">Action Menu</h6>
			<Nav className="zl_add_currency_row row">
				<div className="zl_currency_column_sub_row">

					<Nav.Item key={1} className="zl_add_currency_column col">
						<Nav.Link className="zl_add_currency_inner_content">
							<div className="">
								<div>
                                    <h5 className="mb-1">Send</h5>
                                    <p className="text-secondary" style={{marginBottom: '0px'}}>Transfer funds to contact</p>
								</div>
							</div>
						</Nav.Link>
					</Nav.Item>

					<Nav.Item key={2} className="zl_add_currency_column col">
						<Nav.Link className="zl_add_currency_inner_content">
							<div className="">
								<div>
                                    <h5 className="mb-1">Receive</h5>
                                    <p className="text-secondary" style={{marginBottom: '0px'}}>Send transfer request to contact</p>
								</div>
							</div>
						</Nav.Link>
					</Nav.Item>
					
				</div>
			</Nav>
            
            <h6 className="mb-0 text-white">Transfer History</h6>
            <div className="overflow-auto" id="scrollableDiv" style={{height:"300px"}}>

				<InfiniteScroll
					dataLength={contactHistory.length}
					next={fetchMoreData}
					hasMore={hasMore|| false}
					loader={
						<div className="zl_recive_address_content" style={{width: "100%"}}>
							<div className="zl_recive_copy_address_content" style={{width: "100%"}}>
							<p style={{ textAlign: "center", width: "100%" }}>
							  <b>Loading...</b>
							</p>
							</div>
						</div>
					}
					endMessage={
						<div className="zl_recive_address_content" style={{width: "100%"}}>
							<div className="zl_recive_copy_address_content" style={{width: "100%"}}>
							<p style={{ textAlign: "center", width: "100%" }}>
							  <b>No More Records</b>
							</p>
							</div>
						</div>
					}
					scrollableTarget="scrollableDiv"
				>
											
					<Table className="zl_transaction_list_table">
						<thead>
							<tr>
								<th className="zl_transaction_list_table_heading">type</th>
								<th className="zl_transaction_list_table_heading">transaction id</th>
								<th className="zl_transaction_list_table_heading">amount</th>
								<th className="zl_transaction_list_table_heading">fee</th>
								<th className="zl_transaction_list_table_heading">date</th>
							</tr>
						</thead>
						<tbody>
							{contactHistory.map((transactionListData, i) => (
								<tr key={transactionListData._id}>

									<td className="zl_transaction_list_name" style={{ textTransform: "uppercase" }}>{transactionListData.internaltype}</td>
									<td className="zl_transaction_list_id">{transactionListData.details.txid.substr(0,7) + '...' + transactionListData.details.txid.substr(-7)}</td>
									<td className={(transactionListData.direction==='in'?'zl_transaction_pluse':'zl_transaction_minas') + " zl_transaction_list_value"}>{(transactionListData.direction==='in'?'+':'-')}{transactionListData.amount}</td>
									<td className="zl_transaction_list_name">{(transactionListData.direction==='in'?'N/A':transactionListData.details.fee)}</td>
									<td className="zl_transaction_list_date">{transactionListData.details.timestamp.human.substr(0,19).replace('T',' ')}</td>
								</tr>
							))}
						</tbody>
					</Table>
                
                </InfiniteScroll>
            </div>
            

            
            
        </section>
    );
}

export default connect(null, null)(ViewContactModule);