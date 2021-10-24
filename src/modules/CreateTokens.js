import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { toast } from 'react-toastify';
import { Tab, Nav, Modal, Button, FormControl, Form } from 'react-bootstrap';

import store from "../store/index";
import { updateStore } from "../store/actions/index";
import { useHistory } from "react-router-dom"

// SERVICES
import userService from '../services/userService';


const CreateTokenModule = ({ props }) => {

    const [state, setState] = React.useState(store.getState());

    const [tokenForm, setTokenForm] = React.useState({});

	let history = useHistory()

    React.useEffect(() => {
        // Runs after the first render() lifecycle

        (async () => {

            let res = await userService.get();

            console.log(res);

            if (res.status === true) {
                setState({ user: res.user });

                store.dispatch(updateStore({ key: 'user', value: res.user }));

                if (!state.userImages || !state.userImages.userid) {

                    let resi = await userService.getimages();

                    if (resi.status === true) {
                        store.dispatch(updateStore({ key: 'userImages', value: resi.userimages }));
                    }

                }

            }

            if (res.status === false) {
                // redirect

                toast.error('Authentication Session Has Expired');
                history.push('/login/');

            }

        })();


    }, []);

    const handleTokenFormChange = event => {


		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

        var currentTokenForm = {};
            
        Object.assign(currentTokenForm, tokenForm);
        
		currentTokenForm[event.target.id] = event.target.value;

		setTokenForm(currentTokenForm);


    };

    const doCreateQslp1 = event => {


        var tokenname = tokenForm.token_name || null;
        var tokenticker = tokenForm.token_ticker || null;
        var tokenquantity = tokenForm.token_quantity || null;
        var tokendecimals = tokenForm.token_decimals || null;
        var tokendocumenturi = tokenForm.token_documenturi || null;
        var tokennotes = tokenForm.token_notes || null;
        var tokenpausable = tokenForm.token_pausable || false;
        var tokenmintable = tokenForm.token_mintable || false;

        var pass = tokenForm.token_password || null;

        var error = false;

        var address = 'XQRJgWWdxrUqn7hnrtMWbVh7wgz2tP6hnh';
        var amount = 1;

		if (!tokenname || !tokenticker || !tokenquantity || !tokendecimals || !pass) error = true;
		
		if (!parseInt(tokendecimals)) error = true
		if (!parseFloat(tokendecimals)) error = true


        if (error === true) {

            toast.error('Form error');

        }
        else {

            (async () => {
            
            	var tobject = {
									qslp1: {
										tp: 'GENESIS',
										de: parseInt(tokendecimals),
										sy: tokenticker,
										na: tokenname,
										du: tokendocumenturi,
										qt: parseFloat(tokenquantity),
										no: tokennotes,
										pa: tokenpausable,
										mi: tokenmintable
									}
								};

            	var vendor = JSON.stringify(tobject);
            	
            	var walletid;
            	
            	for (let i = 0; i < state.user.wallets.length; i++)
            	{
            	
            		let tw = state.user.wallets[i];
            		
            		if (tw.currencyid.ticker === "XQR") walletid = state.user.wallets[i]._id;
            	
            	}
            	
                let res = await userService.sendtransaction(walletid, null, address, amount, pass, vendor);

                if (res.status === true) {

                    toast.success(res.message);

                	setTokenForm({});

                }
                else {

                    toast.error(res.message);

                }

            })();

        }


    };

    const doCreateQslp2 = event => {


    };
    
    const doCreateAslp1 = event => {

        var tokenname = tokenForm.token_name || null;
        var tokenticker = tokenForm.token_ticker || null;
        var tokenquantity = tokenForm.token_quantity || null;
        var tokendecimals = tokenForm.token_decimals || null;
        var tokendocumenturi = tokenForm.token_documenturi || null;
        var tokennotes = tokenForm.token_notes || null;
        var tokenpausable = tokenForm.token_pausable || false;
        var tokenmintable = tokenForm.token_mintable || false;

        var pass = tokenForm.token_password || null;

        var error = false;

        var address = 'ARKQXzHvEWXgfCgAcJWJQKUMus5uE6Yckr';
        var amount = 1;

		if (!tokenname || !tokenticker || !tokenquantity || !tokendecimals || !pass) error = true;
		
		if (!parseInt(tokendecimals)) error = true
		if (!parseFloat(tokendecimals)) error = true


        if (error === true) {

            toast.error('Form error');

        }
        else {

            (async () => {
            
            	var tobject = {
									aslp1: {
										tp: 'GENESIS',
										de: parseInt(tokendecimals),
										sy: tokenticker,
										na: tokenname,
										du: tokendocumenturi,
										qt: parseFloat(tokenquantity),
										no: tokennotes,
										pa: tokenpausable,
										mi: tokenmintable
									}
								};

            	var vendor = JSON.stringify(tobject);
            	
            	var walletid;
            	
            	for (let i = 0; i < state.user.wallets.length; i++)
            	{
            	
            		let tw = state.user.wallets[i];
            		
            		if (tw.currencyid.ticker === "ARK") walletid = state.user.wallets[i]._id;
            	
            	}
            	
                let res = await userService.sendtransaction(walletid, null, address, amount, pass, vendor);

                if (res.status === true) {

                    toast.success(res.message);

                	setTokenForm({});

                }
                else {

                    toast.error(res.message);

                }

            })();

        }

    };
    
    const doCreateAslp2 = event => {


    };
    
    return (
        <>
            <section className="zl_history_page">
                <HeadingModule name={'Tokens'} />
                <Tab.Container id="left-tabs-example" defaultActiveKey="">
                    <div className="zl_add_currency_content">
                        <h3 className="zl_bottom_content_heading">Select Token Platform</h3>
                        <Nav className="zl_add_currency_row row">
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab1" className="zl_add_currency_inner_content zl_add_bitcoin_currency">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
												&nbsp;Qredit QSLP-1 (Fungible)
											</h3>
                                            <p>Create Token (1.02 XQR)</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab2" className="zl_add_currency_inner_content zl_add_bitcoin_currency">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
												&nbsp;Qredit QSLP-2 (Non-Fungible)
											</h3>
                                            <p>Create Token (1.02 XQR)</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            
                            
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab3" className="zl_add_currency_inner_content zl_add_ethereum_currency">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
												&nbsp;Ark ASLP-1 (Fungible)
											</h3>
                                            <p>Create Token: (1.04 ARK)</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="zl_add_currency_column col">
                                <Nav.Link eventKey="tab4" className="zl_add_currency_inner_content zl_add_ethereum_currency">
                                    <div className="zl_add_currency_price">
                                        <div className="zl_add_currency_left_price">
                                            <h3>
                                            	<img style={{width: '20px', height: '20px'}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
												&nbsp;Ark ASLP-2 (Non-Fungible)
											</h3>
                                            <p>Create Token: (1.04 ARK)</p>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>

                        </Nav>
                    </div>
                    <Tab.Content>
                        <Tab.Pane eventKey='tab1' key='tab1'>

							<div className="zl_chart_component active">
								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<img style={{width: '25px', height: '25px', marginRight: '10px'}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
													Create New QSLP-1 Token
												</h3>



												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Name"
														id="token_name"
														value={tokenForm.token_name || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The name of your token.  Can be between 3 and 24 characters.  ie. 'Qredit'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Ticker"
														id="token_ticker"
														value={tokenForm.token_ticker || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The ticker code your your token.  Can be between 3 and 8 characters.  ie. 'XQR'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Quantity"
														id="token_quantity"
														value={tokenForm.token_quantity || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The initial circulating quantity to mint.  Can be no more than 19 digits including decimal places.  ie. 10000000</i>

												</div>


												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Decimal Places"
														id="token_decimals"
														value={tokenForm.token_decimals || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The number of decimal places the token uses.  Can from 0 to 8.  ie. 8</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Document URI"
														id="token_documenturi"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>If you want to associate a web url, you can put that here.  ie. https://qredit.io</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Notes"
														id="token_notes"
														value={tokenForm.token_notes || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>For any notes you may want to attach with the genesis transaction</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_pausable'
														label="Pausable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_pausable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to pause the contact at any time.</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_mintable'
														label="Mintable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_mintable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to mint additional tokens at any time</i>

												</div>
												

												<input type="email" name="email" style={{display: 'none'}} /*stoopid google*/ />
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													Your Password &nbsp; <FormControl
														type="password"
														id="token_password"
														value={tokenForm.token_password || ''}
														onChange={handleTokenFormChange}
														style={{width: 'unset'}}
													/>
													
												</div>


												
	
												<div className="zl_send_currency_btn_text primary-color" style={{marginTop: '10px'}}>
													<Button onClick={doCreateQslp1} className="btn btn-success">
														Create QSLP-1 Token
													</Button>
													<span style={{marginLeft: '20px'}}>Service Fee: 1 XQR<br />Network Fee: 0.02 XQR</span>
												</div>
												
												
												
												
												

												
												
												
												
												
												
												
											</div>
										</div>

									</div>
								</div>

							</div>


                        </Tab.Pane>
                        <Tab.Pane eventKey='tab2' key='tab2'>




							<div className="zl_chart_component active">
								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
													<img style={{width: '25px', height: '25px', marginRight: '10px'}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjUwLjAwMDAwMHB0IiBoZWlnaHQ9IjI1MC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDI1MC4wMDAwMDAgMjUwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjUwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0VFRUVFRSIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTExNSAyMTMzIGMxMSAtMTEgNTIgLTQ4IDkwIC04MyAxNzMgLTE1NiAzMDkgLTI5NiAzMjggLTM0MCAyNyAtNjEKMjYgLTEzOCAtNCAtMjMwIC0yMSAtNjcgLTI0IC05MyAtMjQgLTIzNSAwIC0xODggMTEgLTIzOSA4NSAtMzkwIDExMiAtMjMwCjMxOCAtMzk4IDU2OCAtNDYxIDEyOCAtMzMgMjkyIC0zNCA0MTkgLTQgMTAzIDI0IDI2OSAxMDMgMzMxIDE1NyBsNDMgMzggLTgzCjYzIC04MyA2NCAtNSAtMzQgYy00IC0yNyAtMTYgLTQwIC02OCAtNzQgLTIyMCAtMTQ1IC01MzMgLTExNiAtNzc5IDcyIC0xOTcKMTUxIC0zMDYgNDEyIC0yNzMgNjU0IDEyIDkxIDQ4IDIwMSA4NyAyNjkgMjEgMzYgMjMgNDUgMTIgNTYgLTE0IDEyIC01NTAgNDE2Ci02MjQgNDY5IC0yMiAxNiAtMzEgMjAgLTIwIDl6Ii8+CjxwYXRoIGQ9Ik0xMTkwIDIxMDEgYy0xMDcgLTIzIC0yMTIgLTY4IC0zMDQgLTEyOCAtNzQgLTQ5IC0yMDYgLTE3NiAtMjA2Ci0xOTggMCAtNyAzMyAtMzcgNzMgLTY4IDcwIC01MyA3MyAtNTQgNjkgLTI4IC04IDU3IDE3NyAxOTQgMzMzIDI0NyAxMDggMzYKMjY4IDQ0IDM3OSAyMCAyMDAgLTQ1IDM4NyAtMTkxIDQ3OCAtMzczIDY0IC0xMjcgODIgLTIxMyA3NiAtMzY2IC02IC0xMzcgLTMwCi0yMjIgLTk1IC0zMzAgLTE5IC0zMiAtMzIgLTY0IC0zMCAtNzEgMyAtOCA1MCAtNDcgMTA0IC04NyA1NCAtNDAgMTYxIC0xMjAKMjM4IC0xNzggMTUzIC0xMTUgMTUzIC0xMTggMSA1OSAtMTIxIDE0MCAtMTQyIDIzMCAtOTEgMzk1IDM5IDEyOCA0NSAyOTEgMTYKNDMwIC01NSAyNjcgLTIzOSA0OTcgLTQ5MyA2MTQgLTExOCA1NSAtMTk0IDcyIC0zMzggNzcgLTk3IDMgLTE0NCAwIC0yMTAgLTE1eiIvPgo8cGF0aCBkPSJNODgyIDE2MzggYy0xMCAtMTQgLTMyIDMgNTE4IC00MTIgMTY4IC0xMjcgMzU1IC0yNjggNDE1IC0zMTQgMTAwCi03NyAxMTAgLTgyIDExMyAtNjIgNiAzNyAtNyA4NiAtMjkgMTE0IC0xMiAxNSAtMTI3IDEwNiAtMjU4IDIwMyAtMTMwIDk3Ci0zMjEgMjQwIC00MjYgMzE4IC0xMDQgNzggLTIwMCAxNDcgLTIxMiAxNTQgLTI5IDE1IC0xMDggMTQgLTEyMSAtMXoiLz4KPHBhdGggZD0iTTE0NTAgMTA5NCBjMCAtNzQgMzEgLTEwOCAyNDYgLTI2OSAzMjUgLTI0NCA1NzYgLTQyOSA1OTggLTQ0MiAyNQotMTUgMTA1IC0xNyAxMjYgLTMgOCA1IDEyIDExIDEwIDEzIC0zIDMgLTM0IDI3IC03MCA1NCAtMzYgMjcgLTEzOSAxMDUgLTIzMAoxNzQgLTkxIDY5IC0yNzUgMjA4IC00MTAgMzA5IC0xMzUgMTAxIC0yNTEgMTg3IC0yNTcgMTkzIC0xMCA3IC0xMyAwIC0xMyAtMjl6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="currency-icon" />
													Create New QSLP-2 Token
												</h3>



												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Name"
														id="token_name"
														value={tokenForm.token_name || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The name of your token.  Can be between 3 and 24 characters.  ie. 'Qredit'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Ticker"
														id="token_ticker"
														value={tokenForm.token_ticker || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The ticker code your your token.  Can be between 3 and 8 characters.  ie. 'XQR'</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Document URI"
														id="token_documenturi"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>If you want to associate a web url, you can put that here.  ie. https://qredit.io</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Notes"
														id="token_notes"
														value={tokenForm.token_notes || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>For any notes you may want to attach with the genesis transaction</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_pausable'
														label="Pausable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_pausable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to pause the contact at any time.</i>

												</div>

												<input type="email" name="email" style={{display: 'none'}} /*stoopid google*/ />

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													Your Password &nbsp; <FormControl
														type="password"
														id="token_password"
														value={tokenForm.token_password || ''}
														onChange={handleTokenFormChange}
														style={{width: 'unset'}}
													/>
													
												</div>
	
												<div className="zl_send_currency_btn_text primary-color" style={{marginTop: '10px'}}>
													<Button onClick={doCreateQslp2} className="btn btn-success">
														Create QSLP-2 Token
													</Button>
													<span style={{marginLeft: '20px'}}>Service Fee: 1 XQR<br />Network Fee: 0.02 XQR</span>
												</div>
											</div>
										</div>

									</div>
								</div>

							</div>




                        </Tab.Pane>
                        <Tab.Pane eventKey='tab3' key='tab3'>


							<div className="zl_chart_component active">
								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
                                            		<img style={{width: '25px', height: '25px', marginRight: '10px'}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
													Create New ASLP-1 Token
												</h3>



												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Name"
														id="token_name"
														value={tokenForm.token_name || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The name of your token.  Can be between 3 and 24 characters.  ie. 'Qredit'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Ticker"
														id="token_ticker"
														value={tokenForm.token_ticker || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The ticker code your your token.  Can be between 3 and 8 characters.  ie. 'XQR'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Quantity"
														id="token_quantity"
														value={tokenForm.token_quantity || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The initial circulating quantity to mint.  Can be no more than 19 digits including decimal places.  ie. 10000000</i>

												</div>


												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Decimal Places"
														id="token_decimals"
														value={tokenForm.token_decimals || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The number of decimal places the token uses.  Can from 0 to 8.  ie. 8</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Document URI"
														id="token_documenturi"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>If you want to associate a web url, you can put that here.  ie. https://qredit.io</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Notes"
														id="token_notes"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>For any notes you may want to attach with the genesis transaction</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_pausable'
														label="Pausable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_pausable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to pause the contact at any time.</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_mintable'
														label="Mintable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_mintable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to mint additional tokens at any time</i>

												</div>
												
												<input type="email" name="email" style={{display: 'none'}} /*stoopid google*/ />

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													Your Password &nbsp; <FormControl
														type="password"
														id="token_password"
														value={tokenForm.token_password || ''}
														onChange={handleTokenFormChange}
														style={{width: 'unset'}}
													/>
													
												</div>
	
												<div className="zl_send_currency_btn_text primary-color" style={{marginTop: '10px'}}>
													<Button onClick={doCreateAslp1} className="btn btn-success">
														Create ASLP-1 Token
													</Button>
													<span style={{marginLeft: '20px'}}>Service Fee: 1 ARK<br />Network Fee: 0.04 ARK</span>
												</div>
											</div>
										</div>

									</div>
								</div>

							</div>


                        </Tab.Pane>
                        <Tab.Pane eventKey='tab4' key='tab4'>


							<div className="zl_chart_component active">
								<div className="zl_send_recive_content">
									<div className="zl_send_recive_content_row">
										<div className="zl_send_recive_content_column">
											<div className="zl_send_recive_inner_content">
												<h3 className="zl_send_recive_heading">
                                            		<img style={{width: '25px', height: '25px', marginRight: '10px'}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNjOTI5MmMiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LosINGB0LrRgNGD0LPQuy4g0YPQs9C70YsgMSIgcng9IjkwIiByeT0iOTAiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDY1LjU1IDk3NC41bC00NjQuMy00OTEuMTNMMTMzLjU1MyA5NzQuNWw0NjcuNy03NTQuOTd6TTUxOC41ODIgNjgzLjI0OGgxNjQuMmwtODEuNTMyLTg0LjUyMXpNODEwLjc1MSA4MTYuODhsLTc0Ljc0LTc4LjgwOUg0NjUuMzU3bC03NC43NCA3OC44MDloNDIwLjEzNHoiIGRhdGEtbmFtZT0i0KTQuNCz0YPRgNCwIDMg0LrQvtC/0LjRjyIvPjwvc3ZnPg==" alt="currency-icon" />
													Create New ASLP-2 Token
												</h3>



												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Name"
														id="token_name"
														value={tokenForm.token_name || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The name of your token.  Can be between 3 and 24 characters.  ie. 'Qredit'</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Token Ticker"
														id="token_ticker"
														value={tokenForm.token_ticker || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>The ticker code your your token.  Can be between 3 and 8 characters.  ie. 'XQR'</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Document URI"
														id="token_documenturi"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>If you want to associate a web url, you can put that here.  ie. https://qredit.io</i>

												</div>
												
												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<FormControl
														placeholder="Notes"
														id="token_notes"
														value={tokenForm.token_documenturi || ''}
														onChange={handleTokenFormChange}
													/>
													<i style={{fontSize: '12px', marginBottom: '0px', marginTop: '-6px'}}>For any notes you may want to attach with the genesis transaction</i>

												</div>

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													<Form.Check
														id='token_pausable'
														label="Pausable"
														className="zl_custom_currency_checkbox"
														checked={tokenForm.token_pausable}
														onChange={handleTokenFormChange}
													/>
													
													&nbsp;- <i style={{fontSize: '12px', marginLeft: '10px'}}>Checking this box will allow the owner (you) to pause the contact at any time.</i>

												</div>

												<input type="email" name="email" style={{display: 'none'}} /*stoopid google*/ />

												<div className="zl_send_currency_input_content primary-color" style={{ borderBottom: '0px', paddingBottom: '5px', paddingTop: '10px'}}>

													Your Password &nbsp; <FormControl
														type="password"
														id="token_password"
														value={tokenForm.token_password || ''}
														onChange={handleTokenFormChange}
														style={{width: 'unset'}}
													/>
													
												</div>
	
												<div className="zl_send_currency_btn_text primary-color" style={{marginTop: '10px'}}>
													<Button onClick={doCreateAslp2} className="btn btn-success">
														Create ASLP-1 Token
													</Button>
													<span style={{marginLeft: '20px'}}>Service Fee: 1 ARK<br />Network Fee: 0.04 ARK</span>
												</div>
											</div>
										</div>

									</div>
								</div>

							</div>



                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </section>
        </>
    );
}

export default connect(null, null)(CreateTokenModule);