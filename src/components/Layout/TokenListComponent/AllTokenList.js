import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from 'react-bootstrap';

const tokenList = [
    {
        id: 1,
        transactionType: 'assets/image/tableBitcoin.png',
        transactionName: 'Qredit',
        transactionId: '5bfa9573d7bc89742a4b8ec5f1da0ed09475bfa9573d7bc8',
        transactionValue: '+0.025',
        transactionValueUpDown: 'zl_transaction_pluse',
        transactionStatus: 'Completed',
        transactionStatusUpDown: 'zl_transaction_completed',
        transactionDate: '08/26/2018'
    }
];

const AllTokenListComponent = (props) => {
    // Transaction list
    const [transaction, setTransaction] = useState(tokenList);
    useEffect(() => {
        const regex = new RegExp(props.value, 'i');
        const filtered = tokenList.filter((item) => {
            return (item['transactionName'].search(regex) > -1);
        });
        setTransaction(filtered);
    }, [props]);

    return (
        <>
            <div className="overflow-auto">
                <Table className="zl_transaction_list_table">
                    <thead>
                        <tr>
                            <th className="zl_transaction_list_table_heading">type</th>
                            <th className="zl_transaction_list_table_heading">name</th>
                            <th className="zl_transaction_list_table_heading">transaction id</th>
                            <th className="zl_transaction_list_table_heading">value</th>
                            <th className="zl_transaction_list_table_heading">status</th>
                            <th className="zl_transaction_list_table_heading">date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.map((tokenListData, i) => (
                            <tr key={tokenListData.id}>
                                <td className="zl_transaction_list_type">
                                    <img src={tokenListData.transactionType} alt="transaction-icon" />
                                </td>
                                <td className="zl_transaction_list_name">{tokenListData.transactionName}</td>
                                <td className="zl_transaction_list_id">{tokenListData.transactionId}</td>
                                <td className={`${tokenListData.transactionValueUpDown} zl_transaction_list_value`}>{tokenListData.transactionValue}</td>
                                <td className={`${tokenListData.transactionStatusUpDown} zl_transaction_list_status`}>{tokenListData.transactionStatus}</td>
                                <td className="zl_transaction_list_date">{tokenListData.transactionDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default connect(null, null)(AllTokenListComponent);
