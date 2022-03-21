import React from 'react';
import ReactDOM from 'react-dom';

import 'handsontable/dist/handsontable.full.css'
// import './index.css';
import Auth from './Pages/Auth';
import { supabase } from './Configs/supabase';
import {BrowserRouter} from 'react-router-dom'



// window.onbeforeunload = function() {
//     return "Are you sure you want to leave";
// }

ReactDOM.render( 
<BrowserRouter>
    <Auth supabaseClient = {supabase}/>
</BrowserRouter>
, document.getElementById('root'));
