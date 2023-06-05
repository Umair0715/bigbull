import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProvider } from './Context/context';
import { Provider } from 'react-redux';
import store from './redux/store';

import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store} >
        <AppProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AppProvider>
    </Provider>

)
