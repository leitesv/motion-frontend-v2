import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

const ShowModalModule = ({ props }) => {

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


    const modalData = state.modalData;
    const modalButton = state.modalButton;
    const modalTitle = state.modalTitle;
    const modalCode = state.modalCode;

    var show = false;


    const closeModal = () => {

        store.dispatch(updateStore({ key: 'modalData', value: null }));
        store.dispatch(updateStore({ key: 'modalCode', value: null }));
        store.dispatch(updateStore({ key: 'modalButton', value: null }));
        store.dispatch(updateStore({ key: 'modalTitle', value: null }));

        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

    };

    const buttonModal = () => {

        store.dispatch(updateStore({ key: 'modalData', value: null }));
        store.dispatch(updateStore({ key: 'modalCode', value: null }));
        store.dispatch(updateStore({ key: 'modalButton', value: null }));
        store.dispatch(updateStore({ key: 'modalTitle', value: null }));

        store.dispatch(updateStore({ key: 'modalButtonClick', value: true }));

    };


    if (modalData || modalCode) {

        show = true;

    }

    return (
        <Modal centered show={show} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle || ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalData !== null ? parse(modalData || '') : modalCode}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={buttonModal} style={(state.modalButton === null ? { display: 'none' } : {})}>
                    {modalButton || ''}
                </Button>
            </Modal.Footer>
        </Modal>
    );

}



export default connect(null, null)(ShowModalModule);