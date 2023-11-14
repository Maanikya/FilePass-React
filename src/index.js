import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from "@vercel/analytics/*";
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const SendAnalytics = () => {
    ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
    });
}

reportWebVitals(SendAnalytics);

// Vercel Analytics
inject();