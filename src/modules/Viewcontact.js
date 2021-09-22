import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

const ViewContactModule = ({ props }) => {

    const [state, setState] = React.useState({ user: {} });

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

    const setCurrentItem = (e, item) => {

        e.preventDefault();

        /*
        if (state.appservicesItem === item)
        {
            store.dispatch( updateStore({ key: 'appservicesItem', value: null }) );
        }
        else
        {
            store.dispatch( updateStore({ key: 'appservicesItem', value: item }) );
        }
        */

    };

    return (
        <section className="placeholder">
            <HeadingModule name={'PlaceholderTitle'} />
            <div className="zl_SecureBackup_heading">
                <h3>Title</h3>
            </div>
            <div className="card mt-2">
                <div className="card-header">
                    <h6 className="mb-0">Action Menu</h6>
                </div>
                <div className="card-body px-0 pt-0">
                    <div className="list-group list-group-flush border-top border-color">

                        <a onClick={e => setCurrentItem(e, '')} href="/" className="list-group-item list-group-item-action border-color">
                            <div className="row">
                                <div className="col-auto">
                                    <div className="avatar avatar-50 bg-default-light text-default rounded">
                                        <span className="material-icons">call_made</span>
                                    </div>
                                </div>
                                <div className="col align-self-center pl-0">
                                    <h6 className="mb-1">Send</h6>
                                    <p className="text-secondary">Transfer funds to contact</p>
                                </div>
                            </div>
                        </a>

                        <a onClick={e => setCurrentItem(e, '')} href="/" className="list-group-item list-group-item-action border-color">
                            <div className="row">
                                <div className="col-auto">
                                    <div className="avatar avatar-50 bg-default-light text-default rounded">
                                        <span className="material-icons">call_received</span>
                                    </div>
                                </div>
                                <div className="col align-self-center pl-0">
                                    <h6 className="mb-1">Receive</h6>
                                    <p className="text-secondary">Send transfer request to contact</p>
                                </div>
                            </div>
                        </a>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default connect(null, null)(ViewContactModule);