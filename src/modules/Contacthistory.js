import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';

const ContactHistoryModule = ({ props }) => {

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

        let contactid = state.requestedPageExtra;

        (async () => {

            setState({ shownItems: 10 });

            //let res = await userService.getcontacthistory(contactid, 0, 10);

            //if (res.status === true)
            //{
            //	setState({'contacthistory': res.contacthistory});
            //	setState({'hasMore': res.hasmore});
            //}

        })();
    };

    const fetchMoreData = () => {

        let contactid = state.requestedPageExtra;

        (async () => {

            var currentCount = state.shownItems;
            var newCount = currentCount + 10;
            var skip = newCount - 10;
            var limit = 10;

            setState({ shownItems: newCount });

            //let res = await userService.getcontacthistory(contactid, skip, limit);

            //if (res.status === true)
            //{

            //	let newhistory = state.contacthistory.concat(res.contacthistory);

            //	setState({'contacthistory': newhistory});
            //	setState({'hasMore': res.hasmore});
            //}

        })();
    };

    const contactHistory = state.contacthistory || [];

    /* 
        state = store.getState();
        state.contacthistory = [];
        state.hasMore = false;
        state.shownItems = 10;
        
    */
    return (
        <section className="placeholder">
            <HeadingModule name={'PlaceholderTitle'} />
            <div className="zl_SecureBackup_heading">
                <h3>Title</h3>
            </div>
            <div className="card mt-2">
                <div className="card-header">
                    <h6 className="mb-0">Transfer History</h6>
                </div>
                <div className="card-body px-0 pt-0">
                    <div className="list-group list-group-flush border-top border-color">


                        <InfiniteScroll
                            dataLength={contactHistory.length}
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
                            refreshFunction={refresh}
                            pullDownToRefresh
                            pullDownToRefreshThreshold={50}
                            pullDownToRefreshContent={
                                <p style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</p>
                            }
                            releaseToRefreshContent={
                                <p style={{ textAlign: 'center' }}>&#8593; Release to refresh</p>
                            }
                        >
                            {contactHistory.map((historyitem, index) => (

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
                                                    <p className="small text-secondary" style={{ marginBottom: '0px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}></p>
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
            );
        </section>
    );
}

export default connect(null, null)(ContactHistoryModule);