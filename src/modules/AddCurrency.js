import React, { useState } from "react";
import { connect } from "react-redux";
import HeadingModule from '../components/Layout/HeadingComponent/Heading';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify';
import store from "../store/index";
import { updateStore } from "../store/actions/index";

// SERVICES
import userService from '../services/userService';

// import { mapStateToProps } from './mappers';



const AddCurrencyModule = (props) => {

    const [state, setState] = React.useState(store.getState());
    
    const [addCurrency, setAddCurrency] = useState([]);

    const [addForm, setAddForm] = useState({});

    const [filterData, setFilterData] = useState(addCurrency);


    React.useEffect(() => {

        (async () => {

            let res = await userService.get();

            if (res.status === true) {
                store.dispatch(updateStore({ key: 'user', value: res.user }));
                setState(store.getState());

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
                props.history.push('/login/');

            }
            
            try {
            
				let cres = await userService.getavailcryptocurr();

				var cList = [];
			
				for (let i = 0; i < cres.currencies.length; i++)
				{
			
					let thiscurrency = cres.currencies[i];
			
					let item = 
							{
								id: thiscurrency._id,
								image: thiscurrency.logo,
								heading: thiscurrency.ticker,
								peregraph: thiscurrency.name,
								_id: thiscurrency.ticker
							};

					cList.push(item);
			
				}
				
				setAddCurrency(cList);
				
				setFilterData(cList);
				            
            } catch (e) {
            
            	console.log(e);
            
            }
            
            
            

        })();


    }, []);



    const search = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        const regex = new RegExp(event.target.value, 'i');
        console.log(regex);
        const filtered = addCurrency.filter((item) => {
            return ((item['peregraph'].search(regex) && item['heading'].search(regex)) > -1);
        });
        setFilterData(filtered);
    }

    const handleFormChange = event => {

        if (event.target.type === 'checkbox') {
            event.target.value = event.target.checked;
        }
        
        var currentAddForm = {};
            
        Object.assign(currentAddForm, addForm);
            
        currentAddForm[event.target.id] = event.target.value;

        setAddForm(currentAddForm);

    };

    const doAdd = (e, walletid) => {
        e.preventDefault();

        console.log(walletid);
        console.log(addForm[walletid]);

		var ticker = walletid || null;
		var password = addForm[walletid] || null;
	
		var error = false;
		
		if (ticker === null || ticker == '' || password === null || password == '')
		{
			error = true;
		}
		
		if (error === true)
		{
		
			toast.error('Missing password');
		
		}
		else
		{

			(async () => {

				let res = await userService.createcryptowallet(ticker, password);

				if (res.status === true)
				{
				
					
					let res2 = await userService.get();
					
					store.dispatch( updateStore({ key: 'user', value: res2.user }) );
				
					toast.success(res.message);

					try {
			
						let cres = await userService.getavailcryptocurr();

						var cList = [];
			
						for (let i = 0; i < cres.currencies.length; i++)
						{
			
							let thiscurrency = cres.currencies[i];
			
							let item = 
									{
										id: thiscurrency._id,
										image: thiscurrency.logo,
										heading: thiscurrency.ticker,
										peregraph: thiscurrency.name,
										_id: thiscurrency.ticker
									};

							cList.push(item);
			
						}
				
						setAddCurrency(cList);
				
						setFilterData(cList);
							
					} catch (e) {
			
						console.log(e);
			
					}


				}
				else
				{
			
					toast.error(res.message);

				}

			})();
		
		}

    };
    
    return (
        <>
            <section className="zl_add_currency_page">
                <HeadingModule name={'Add Currency'} />
                <div className="zl_all_page_comman_content">
                    <InputGroup className="zl_add_currency_search">
                        <InputGroup.Text className="zl_add_currency_search_icon">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10.0972" cy="10.0968" r="8.58064" stroke="#828CAE" strokeWidth="2" />
                                <path d="M15.9678 16.8709L20.2968 21.2" stroke="#828CAE" strokeWidth="2" />
                            </svg>
                        </InputGroup.Text>
                        <FormControl
                            placeholder="Search"
                            type="text"
                            onChange={search}
                        />
                    </InputGroup>
                    <div className="zl_add_currency_row row">
                        {filterData.map((currencyValue, i) => (
                            <div className="zl_add_currency_column col" key={currencyValue.id}>

								<div className="zl_add_currency_inner_content" style={{display: 'flex', flexDirection: 'column'}}>

                                	<div style={{display: 'flex', flexDirection: 'row'}}>
                                
                                		<div style={{flex:'0'}}>
											<div className="zl_add_currency_img">
												<img src={currencyValue.image} alt="currency-img" style={{height: '50px', marginRight:'5px'}}/>
											</div>
										</div>
									
                                		<div style={{flex:'1'}}>

											<div style={{display: 'flex', flexDirection: 'row'}}>

												<div className="zl_add_currency_text" style={{padding: '0px'}}>
													<h3>{currencyValue.peregraph} ({currencyValue.heading})</h3>
												</div>
											</div>
											<div className="input-group" style={{display: 'flex', flexDirection: 'row'}}>
												<FormControl
													type="password"
													placeholder="Your Password"
													id={currencyValue._id}
													onChange={handleFormChange}
													className="form-control-sm"
												/>
												<div className="input-group-append">
												<Button onClick={e => doAdd(e, currencyValue._id)} className="btn-sm btn-success">
													add
												</Button>
												</div>
											</div>
										</div>

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

export default connect(null, null)(AddCurrencyModule);
