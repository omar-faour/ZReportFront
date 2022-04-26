import React from 'react';
import ReactDOM from 'react-dom';

import 'handsontable/dist/handsontable.full.css'
// import './index.css';
import Auth from './Pages/Auth';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from "react-redux";
import store from "./redux/store";
import { PersistGate } from "redux-persist/es/integration/react";
import { persistStore } from "redux-persist";


// window.onbeforeunload = function() {
//     return "Are you sure you want to leave";
// }

let persistor = persistStore(store);

ReactDOM.render( 
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
            <Auth/>
        </BrowserRouter>
    </PersistGate>
</Provider>
, document.getElementById('root'));
