import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Component from './Components/Component';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <Component/>
  </React.StrictMode>
);

