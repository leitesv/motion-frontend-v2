import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

const ViewContactHeaderModule = ({ props }) => {

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
    var contactid = '';
    var contactfamilyname = '';
    var contactgivenname = '';
    var contactcountry = '';
    var contactemail = '';
    var contactphone = '';

    if (state.contact) {

        if (state.user._id === state.contact.userid_a._id) {

            contactid = state.contact.userid_b._id;
            contactfamilyname = state.contact.userid_b.familyname;
            contactgivenname = state.contact.userid_b.givenname;
            contactcountry = state.contact.userid_b.residence_country;
            contactemail = state.contact.userid_b.email;
            contactphone = state.contact.userid_b.phone_number;

        }
        else {

            contactid = state.contact.userid_a._id;
            contactfamilyname = state.contact.userid_a.familyname;
            contactgivenname = state.contact.userid_a.givenname;
            contactcountry = state.contact.userid_a.residence_country;
            contactemail = state.contact.userid_a.email;
            contactphone = state.contact.userid_a.phone_number;

        }

    }

    var backgroundImage = 'url(api/backgroundimage/' + state.contactid + ')';

    var profileImage = 'url(api/profileimage/' + state.contactid + ')';

    return (

        <>
            <div className="container-fluid px-0">
                <div className="card overflow-hidden" style={{ background: 'transparent', maxWidth: '1140px', margin: 'auto' }}>
                    <div className="card-body p-0 h-150">
                        <div className="background text-center" style={{ backgroundImage: backgroundImage }} >

                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid top-70 text-center mb-4">
                <div className="avatar avatar-140 rounded-circle mx-auto shadow">
                    <div className="background" style={{ backgroundImage: profileImage }} >

                    </div>
                </div>
            </div>

            <div className="container mb-4 text-center text-white">
                <h6 className="mb-1">{contactgivenname} {contactfamilyname}</h6>
                <p>{contactcountry}</p>
                <p className="mb-1">{contactemail}</p>
                <p>{contactphone}</p>
            </div>
        </>
    );
}

export default connect(null, null)(ViewContactHeaderModule);