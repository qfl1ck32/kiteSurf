import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { MDBContainer, MDBJumbotron } from 'mdbreact'
import { Form, Image, Button } from 'react-bootstrap'

import NewField from '../components/FormField'
import useLocalStorage from '../services/useLocalStorage'

import '../assets/css/main.css'
import Kite from '../assets/images/Kite.svg'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'

import * as Yup from 'yup'
import { useFormik } from 'formik'

import axios from 'axios'

const apiURL = require('../assets/apiURL.json').url

function Login() {

    const [user, setUser] = useLocalStorage('user')
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (user != null)
            setRedirect(true)
    }, [])

    const setRequestFailedMessage = response => {
        return setLoginMessage({
            hide: false,
            danger: true,
            message: 'Something went wrong. Server replied with: "' + response.data + '".'
        })
    }

    const tryLogin = async () => {
        let loginRequest, loginLogID
            
        try {
            loginRequest = await axios.get(apiURL + 'user')

            const newLoginLog = await axios.post(apiURL + 'login')
            
            loginLogID = newLoginLog.data.id
        }

        catch (err) {
            return setRequestFailedMessage(err.response.data)
        }

        const users = loginRequest.data

        const randomUserIndex = Math.floor(Math.random() * Object.keys(users).length)
        
        const user = users[randomUserIndex]

        try {
            await axios.put(apiURL + 'login/' + loginLogID, { userId: user.id })
        }

        catch (err) {
            return setRequestFailedMessage(err.response.data)
        }

        setUser(user)

        setLoginMessage({
            hide: false,
            danger: false,
            message: 'Successfully logged in!'
        })

        await new Promise(resolve => {
            setTimeout(resolve, 1000)
        })
        
        setRedirect(true)
    }

    const [loginMessage, setLoginMessage] = useState({
        hide: true,
        danger: false,
        message: ''
    })

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('This field should not be empty.')
            .min(2, 'Username should have a length of at least two characters.'),
        password: Yup.string()
            .required('This field should not be empty.')
            .min(6, 'Password should be at least 6 characters long.')
    })

    const { errors, touched, values, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: {
            username: '',
            password: '',

            fadeErrors: true
        },

        onSubmit: tryLogin,

        validationSchema
    })

    const handleSubmitFadeErrors = e => {
        handleSubmit(e)

        setValues({...values, ...{'fadeErrors': false}})

        setTimeout(() => {
            setValues({...values, ...{'fadeErrors': true}})
        }, 0)

        setLoginMessage({
            hide: true
        })
    }

    const newFieldSetup = (name, fieldName, placeholder, type) => {
        return {
            name: name,
            fieldName: fieldName,
            errors: errors,
            touched: touched,
            values: values,
            placeHolder: placeholder,
            type: type,
            handleChange
          }
    }

    const username = NewField(newFieldSetup('Username', 'username', 'George', 'text'))
    const password = NewField(newFieldSetup('Password', 'password', '••••••••', 'password'))

    return redirect ? <Redirect to = '/Dashboard' /> :
    (
        <MDBContainer fluid className = 'main d-flex align-items-center justify-content-center'>
            <MDBJumbotron className = 'w-50 bg-primary'>

                <MDBContainer className = 'display-4 text-center'>
                    <Image fluid src = { Kite } />
                </MDBContainer>

                <MDBContainer className = { loginMessage.hide ? 'd-none' : ('alert ' + (loginMessage.danger ? 'alert-danger' : 'alert-success')) }>
                    { loginMessage.message }
                </MDBContainer>

                <Form className = 'text-center' noValidate onSubmit = { handleSubmitFadeErrors }>
                    { username }
                    { password }

                    <Button className = 'text-white bg-primary' type = 'submit'>Login</Button> 
                </Form>

            </MDBJumbotron>
        </MDBContainer>
    )
}

export default Login