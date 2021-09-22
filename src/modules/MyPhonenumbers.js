import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav } from 'react-bootstrap';
import store from "../store/index";
import { updateStore } from "../store/updateStore";
import InfiniteScroll from "react-infinite-scroll-component";
// SERVICES
import userService from '../services/userService';

const MyPhonenumbersModule = ({ props }) => {

    //const [state, setState] = React.useState({ user: {} });

    const [state, setState] = React.useState(store.getState());


    React.useEffect(() => {


        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });
            }

            if (res.status === false) {

                toast.error('Authentication Session Has Expired');
                props.history.push('/login/');

            }

        })();


    }, []);


    return (
        <section className="placeholder">
            <HeadingModule name={'My Phonenumbers'} />
            <div className="zl_SecureBackup_heading">
                <h3>My Phonenumbers</h3>
            </div>

        </section>
    );
}

export default connect(null, null)(MyPhonenumbersModule);