import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../../../services/userService';



const AllTransactionListComponent = (props) => {

    const [walletid, setWalletid] = useState(props.value._id);
    const [translist, setTranslist] = useState([]);
    const [hasmore, setHasmore] = useState(false);
    const [shownitems, setShownitems] = useState(10);

    useEffect(() => {

        refresh();
        
    }, [props]);

    const refresh = () => {

        (async () => {

            setShownitems(10);

            let res = await userService.getwallettransactions(walletid, 0, 10);

//console.log(res);

            if (res.status === true) {
            
            	setTranslist(res.transactionlist);
            	setHasmore(res.hasmore);

            }

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = shownitems || 10;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setShownitems( newCount );

            let res = await userService.getwallettransactions(walletid, skip, limit);

//console.log(res);

            if (res.status === true) {
            
            	let curlist = translist;

                let newhistory = curlist.concat(res.transactionlist);

            	setTranslist(newhistory);
            	setHasmore(res.hasmore);

            }

        })();
    };

	const getType = (type) => {
	
		var typetext = '';
	
		if (type === 0) typetext = 'Transfer';
		if (type === 1) typetext = 'SigReg';
		if (type === 2) typetext = 'DelReg';
		if (type === 3) typetext = 'Vote';
		if (type === 4) typetext = 'Multisig';
		if (type === 5) typetext = 'IPFS';
		if (type === 6) typetext = 'MultiTransfer';
		if (type === 7) typetext = 'DelResign';
		if (type === 8) typetext = 'HTLC';

		if (type === 20) typetext = 'Transfer';
		if (type === 21) typetext = 'Change';

		return typetext;
	
	};
	
	const gotoExplorer = (url, txid) => {
	
		var openurl = url.replace('%txid%', txid);
	
		return openurl;
	
	};
	
    return (
        <>
            <div className="overflow-auto" id="scrollableDiv" style={{height:"300px"}}>

				<InfiniteScroll
					dataLength={translist.length}
					next={fetchMoreData}
					hasMore={hasmore|| false}
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
							{translist.map((transactionListData, i) => (
								<tr key={transactionListData._id}>

									<td className="zl_transaction_list_name" style={{ textTransform: "uppercase" }}>{transactionListData.internaltype} {transactionListData.direction.toUpperCase()}</td>
									<td className="zl_transaction_list_id"><a href={gotoExplorer(transactionListData.currencyid.explorerregex, transactionListData.details.txid)} target="_blank" rel="noreferrer">{transactionListData.details.txid.substr(0,7) + '...' + transactionListData.details.txid.substr(-7)}</a></td>
									<td className={(transactionListData.direction==='in'?'zl_transaction_pluse':'zl_transaction_minas') + " zl_transaction_list_value"}>{(transactionListData.direction==='in'?'+':'-')}{parseFloat(transactionListData.amount).toFixed(8)}</td>
									<td className="zl_transaction_list_name">{(transactionListData.direction==='in'?'N/A':transactionListData.details.fee)}</td>
									<td className="zl_transaction_list_date">{transactionListData.details.timestamp.human.substr(0,19).replace('T',' ')}</td>
								</tr>
							))}
						</tbody>
					</Table>
                
                </InfiniteScroll>
            </div>
        </>
    );
}

export default connect(null, null)(AllTransactionListComponent);
