import React from 'react';
import { render } from 'react-snapshot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
// import * as serviceWorker from './serviceWorker';

render(<><App /><ToastContainer newestOnTop={true} style={{top:'5em'}}/></>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {  
      registration.unregister();
    }
  });
}
