import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

import InfiniteScroll from "react-infinite-scroll-component";
// SERVICES
import userService from '../services/userService';

const LoginHistoryModule = ({ props }) => {

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

    const refresh = () => {

        (async () => {

            setState({ shownItems: 10 });

            let res = await userService.getloginhistory(0, 10);

            if (res.status === true) {
                setState({ 'loginhistory': res.loginhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const fetchMoreData = () => {

        (async () => {

            var currentCount = state.shownItems;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            let res = await userService.getloginhistory(skip, limit);

            if (res.status === true) {

                let newhistory = state.loginhistory.concat(res.loginhistory);

                setState({ 'loginhistory': newhistory });
                setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    const parseJsonRegion = (jsonstring) => {
        let data = JSON.parse(jsonstring);
        return data.city + ', ' + data.regionName + ', ' + data.country;
    };

    const setShowItem = (show) => {

        setState({ showitem: show });

        if (show === true) {
            refresh();
        }

    };

    var loginHistory = state.loginHistory || [];

    return (
        <CSSTransition in={state.appservicesItem === 'loginhistory'} timeout={500} classNames="transitionitem" onEnter={() => setShowItem(true)} onExited={() => setShowItem(false)}>

            <div className="card mt-2" style={state.showitem === true ? {} : { display: 'none' }}>
                <div className="card-body px-0 pt-0">
                    <div className="list-group list-group-flush border-top border-color">


                        <InfiniteScroll
                            dataLength={loginHistory.length}
                            next={fetchMoreData}
                            hasMore={state.hasMore}
                            loader={
                                <p style={{ textAlign: "center" }}>
                                    <b>Loading...</b>
                                </p>
                            }
                            height={400}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    <b>No More Records</b>
                                </p>
                            }
                        >
                            {loginHistory.map((historyitem, index) => (

                                <li key={index} className="list-group-item border-color">
                                    <div className="row">
                                        <div className="col">
                                            <div className="row mb-1">
                                                <div className="col">
                                                    <p className="mb-0">{historyitem.ip_address}</p>
                                                </div>
                                                <div className="col-auto pl-0">
                                                    <p className="small text-secondary">{historyitem.created_date}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <p className="small text-secondary" style={{ marginBottom: '0px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{parseJsonRegion(historyitem.ip_region)}</p>
                                                </div>
                                                <div className="col-auto pl-0">
                                                    <p className="small" style={(historyitem.invalidated === true ? { color: 'red' } : { color: 'green' })}>{(historyitem.invalidated === true ? 'Expired' : 'Active')}</p>
                                                </div>
                                            </div>
                                            <p className="small text-secondary" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{historyitem.useragent}</p>
                                        </div>
                                    </div>
                                </li>

                            ))}
                        </InfiniteScroll>


                    </div>
                </div>
            </div>

        </CSSTransition>
    );
}

export default connect(null, null)(LoginHistoryModule);