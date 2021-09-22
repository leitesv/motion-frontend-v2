import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';


// SERVICES
import userService from '../services/userService';


const TwoFactorAuthenticationModule = ({ props }) => {

    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();


    });

    return (
        <section className="placeholder">
            <HeadingModule name={'Two Factor Authentication'} />
            <div className="zl_SecureBackup_heading">
                <h3>Two Factor Authentication</h3>
            </div>

        </section>
    );
}

export default connect(null, null)(TwoFactorAuthenticationModule);