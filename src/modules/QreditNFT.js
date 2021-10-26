import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';


// SERVICES
import userService from '../services/userService';


const QreditNFTModule = ({ props }) => {

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();


    });

    return (
        <section className="placeholder">
            <HeadingModule name={'Qredit NFT'} />
            <div className="zl_SecureBackup_heading">
                <h3>View your non-fungible tokens (QSLP2)</h3>
            </div>

        </section>
    );
}

export default connect(null, null)(QreditNFTModule);