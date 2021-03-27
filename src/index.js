import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Logout from './components/Logout'

class Root extends Component {

  render() {
    return (

      <BrowserRouter>
        <Switch>
          
          <Route path = '/Login' exact>
            <Login />
          </Route>

          <Route path = '/Register' exact>
            <Register />
          </Route>

          <Route path = '/Dashboard' exact>
            <Dashboard />
          </Route>

          <Route path = '/Logout' exact>
            <Logout />
          </Route>

          <Redirect to = '/Dashboard' exact/>

        </Switch>
    </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();