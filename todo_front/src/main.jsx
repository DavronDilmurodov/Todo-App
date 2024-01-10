import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './app.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
            <Toaster position="top-right" />
        </Provider>
    </React.StrictMode>
);
