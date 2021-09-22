import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav, Form, Button, FormGroup, FormControl, ControlLabel, InputGroup } from "react-bootstrap";
import store from "../store/index";
import { updateStore } from "../store/updateStore";
import InfiniteScroll from "react-infinite-scroll-component";
// SERVICES
import userService from '../services/userService';

const RestoreWalletModule = (props) => {

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

    const setLanguage = (e, language) => {

        e.preventDefault();

        let cuser = state.user;
        cuser.preferred_language = language;
        store.dispatch(updateStore({ key: 'user', value: cuser }));

        (async () => {

            let res = await userService.setlanguage(language);

            if (res.status === true) {

                toast.success('Language Setting Updated');
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

    const addCurrency = [
        {
            id: 1,
            image: 'assets/image/Australia.png',
            heading: 'AUD',
            peregraph: 'Australian Dollar',
            activeCurrency: 'active'
        },
        {
            id: 2,
            image: 'assets/image/Brazil.png',
            heading: 'BRL',
            peregraph: 'Brazilian Real',
            activeCurrency: 'unactive'
        },
        {
            id: 3,
            image: 'assets/image/Canada.png',
            heading: 'CAD',
            peregraph: 'Canadian Dollar',
            activeCurrency: 'unactive'
        },
        {
            id: 4,
            image: 'assets/image/Switzerland.png',
            heading: 'CHF',
            peregraph: 'Swiss France',
            activeCurrency: 'unactive'
        },
        {
            id: 5,
            image: 'assets/image/China.png',
            heading: 'CNY',
            peregraph: 'Chinese Yuan',
            activeCurrency: 'unactive'
        },
        {
            id: 6,
            image: 'assets/image/Germany.png',
            heading: 'DEM',
            peregraph: 'Germany',
            activeCurrency: 'unactive'
        },
        {
            id: 7,
            image: 'assets/image/EUROPE.png',
            heading: 'EURO',
            peregraph: 'Europe',
            activeCurrency: 'unactive'
        },
        {
            id: 8,
            image: 'assets/image/France.png',
            heading: 'EURO',
            peregraph: 'France',
            activeCurrency: 'unactive'
        },
        {
            id: 9,
            image: 'assets/image/England.png',
            heading: 'AUD',
            peregraph: 'England',
            activeCurrency: 'unactive'
        },
        {
            id: 10,
            image: 'assets/image/HongKong.png',
            heading: 'BRL',
            peregraph: 'Hong Kong',
            activeCurrency: 'unactive'
        },
        {
            id: 11,
            image: 'assets/image/India.png',
            heading: 'INR',
            peregraph: 'India',
            activeCurrency: 'unactive'
        },
        {
            id: 12,
            image: 'assets/image/Japan.png',
            heading: 'CHF',
            peregraph: 'Japan',
            activeCurrency: 'unactive'
        },
        {
            id: 13,
            image: 'assets/image/Kuwait.png',
            heading: 'CNY',
            peregraph: 'Kuwait',
            activeCurrency: 'unactive'
        },
        {
            id: 14,
            image: 'assets/image/SriLanka.png',
            heading: 'DEM',
            peregraph: 'Sri Lanka',
            activeCurrency: 'unactive'
        },
        {
            id: 15,
            image: 'assets/image/Maldives.png',
            heading: 'EURO',
            peregraph: 'Maldives',
            activeCurrency: 'unactive'
        },
        {
            id: 16,
            image: 'assets/image/Norway.png',
            heading: 'EURO',
            peregraph: 'Norway',
            activeCurrency: 'unactive'
        }
    ];
    return (
        <>
            <section className="zl_currency_page">
                <HeadingModule name={'Language'} />
                <div className="zl_all_page_comman_content">
                    <div in={state.appservicesItem === 'language'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

                        <div className="card-body pt-0 px-0 mb-4" style={state.showitem === true ? {} : { display: 'none' }}>
                            <ul className="list-group list-group-flush ml-4">
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'EN')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'EN' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch1">English</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'NL')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'NL' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch2">Dutch/Nederlands</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'ES')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'ES' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch2">Spanish/Español</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'PT')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'PT' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch3">Portuguese/Português</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'FR')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'FR' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch4">French/Français</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'DE')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'DE' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch5">German/Deutsch</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'ZH')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'ZH' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch5">Chinese/中文</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'KO')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'KO' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch5">Korean/한국어</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="custom-control custom-switch" onClick={e => setLanguage(e, 'JA')} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="language" className="custom-control-input" readOnly checked={(state.user && state.user.preferred_language === 'JA' ? 'checked' : '')} />
                                        <label className="custom-control-label" htmlFor="customSwitch5">Japanese/日本語</label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <InputGroup className="zl_add_currency_search">
                        <InputGroup.Text className="zl_add_currency_search_icon">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10.0972" cy="10.0968" r="8.58064" stroke="#828CAE" stroke-width="2" />
                                <path d="M15.9678 16.8709L20.2968 21.2" stroke="#828CAE" stroke-width="2" />
                            </svg>
                        </InputGroup.Text>
                        <FormControl
                            placeholder="Search"
                            type="text"
                        />
                    </InputGroup>


                    <div className="zl_add_currency_row row">
                        {addCurrency.map((currencyValue, i) => (
                            <div className={`zl_add_currency_column col ${currencyValue.activeCurrency}`}>
                                <div className="zl_add_currency_inner_content">
                                    <div className="zl_add_currency_img">
                                        <img src={currencyValue.image} alt="currency-img" />
                                    </div>
                                    <div className="zl_add_currency_text">
                                        <h3>{currencyValue.heading}</h3>
                                        <p>{currencyValue.peregraph}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default connect(null, null)(RestoreWalletModule);
