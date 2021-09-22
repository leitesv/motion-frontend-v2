import React from "react";
import { connect } from "react-redux";
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import FreshdeskWidget from '@personare/react-freshdesk-widget';
import store from "../store/index";
import { updateStore } from "../store/actions/index";
// SERVICES
import userService from '../services/userService';

const AccountSupportModule = ({ props }) => {

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

    const setNotification = (e, item) => {

        e.preventDefault();

        let cuser = state.user;
        let notiuser = state.user.notifications || {};

        if (notiuser[item]) {
            notiuser[item] = !notiuser[item];
        }
        else {
            notiuser[item] = true;
        }
        cuser.notifications = notiuser;
        store.dispatch(updateStore({ key: 'user', value: cuser }));

        (async () => {

            let res = await userService.setnotification(item, notiuser[item]);

            if (res.status === true) {

                toast.success('Notification Setting Updated');
                store.dispatch(updateStore({ key: 'user', value: res.user }));

            }
            else {
                toast.error(res.message);
            }

        })();

    };

    const setShowItem = (show) => {

        setState({ showitem: show });

    };

    return (
        <>
            <section className="zl_account_support_page">
                <HeadingModule name={'Account Support'} />
                <div className="zl_account_support_input_list">
                    <div className="zl_account_support_input_items">
                        {/*<script type="text/javascript" src="https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js"></script>
                        <style type="text/css" media="screen, projection">
                            @import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css);
                        </style>
                        <iframe title="Feedback Form" class="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://qredit.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&submitTitle=Submit&submitThanks=Thank+you+for+your+message.+Our+support+team+will+get+back+to+you+soon." scrolling="no" height="600px" width="100%" frameborder="0" >
                        </iframe> */}
                        <FreshdeskWidget
                            url="https://qredit.freshdesk.com"
                            type="incorporated"
                            formTitle="Contact Agent"
                            formHeight="600px"
                            submitThanks="Thank you for your message. Our support team will get back to you soon."
                            buttonType="text"
                            buttonText="Send"
                            buttonColor="yellow"
                            buttonBackgroundColor="#828cae"
                            autofill={{ requester: state.user.email }}
                        >
                        </FreshdeskWidget>
                    </div>
                </div>
            </section>
        </>
    );
}

export default connect(null, null)(AccountSupportModule);
