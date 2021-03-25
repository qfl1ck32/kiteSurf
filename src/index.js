import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Login from './components/Login'
import Dashboard from './components/Dashboard'

ReactDOM.render(
  <React.StrictMode>

    <BrowserRouter>
      <Switch>
        <Route path = '/Login' exact component = { Login } />
        <Route path = '/Dashboard' component = { Dashboard } />

        <Redirect to = '/Dashboard' />
      </Switch>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
