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

function Register() {

    const user = useLocalStorage('user')[0]
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (user != null)
            setRedirect(true)
    }, [])

    const tryRegister = async () => {
        let newUser
            
        try {
            newUser = await axios.post(apiURL + 'user')

            const newUserID = newUser.data.id

            await axios.put(apiURL + 'user/' + newUserID, { email: values.email, username: values.username, password: values.password })
        }

        catch (err) {
            const requestResponse = err.response

            return setRegisterMessage({
                hide: false,
                danger: true,
                message: 'Something went wrong. Server replied with: "' + requestResponse.data + '".'
            })
        }

        setRegisterMessage({
            hide: false,
            danger: false,
            message: 'Successfully registered!'
        })

        await new Promise(resolve => {
            setTimeout(resolve, 1000)
        })
        
        setRedirect(true)
    }

    const [registerMessage, setRegisterMessage] = useState({
        hide: true,
        danger: false,
        message: ''
    })

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('This field should not be empty.')
            .min(2, 'Username should have a length of at least two characters.'),
        email: Yup.string()
            .required('This field should not be empty.')
            .email('Invalid e-mail.'),
        password: Yup.string()
            .required('This field should not be empty.')
            .min(6, 'Password should be at least 6 characters long.'),
        confirmPassword: Yup.string()
            .required('This field should not be empty.')
            .min(6, 'Password should be at least 6 characters long.')
            .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    })

    const { errors, touched, values, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',

            fadeErrors: true
        },

        onSubmit: tryRegister,

        validationSchema
    })

    const handleSubmitFadeErrors = e => {
        handleSubmit(e)

        setValues({...values, ...{'fadeErrors': false}})

        setTimeout(() => {
            setValues({...values, ...{'fadeErrors': true}})
        }, 0)

        setRegisterMessage({
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
    const email = NewField(newFieldSetup('Email', 'email', 'niceAccount@gmail.com', 'email'))
    const password = NewField(newFieldSetup('Password', 'password', '••••••••', 'password'))
    const confirmPassword = NewField(newFieldSetup('Confirm password', 'confirmPassword', '••••••••', 'password'))

    return redirect ? (<Redirect to = '/Login' />) :
    (
        <MDBContainer fluid className = 'main d-flex align-items-center justify-content-center'>

            <MDBJumbotron className = 'w-50 bg-primary'>

                <MDBContainer className = 'display-4 text-center'>
                    <Image fluid src = { Kite } />
                </MDBContainer>

                <MDBContainer className = { registerMessage.hide ? 'd-none' : ('alert ' + (registerMessage.danger ? 'alert-danger' : 'alert-success')) }>
                    { registerMessage.message }
                </MDBContainer>

                <Form className = 'text-center' noValidate onSubmit = { handleSubmitFadeErrors }>
                    { username }
                    { email }
                    { password }
                    { confirmPassword }

                    <Button className = 'text-white bg-primary' type = 'submit'>Register</Button> 
                </Form>

            </MDBJumbotron>
        </MDBContainer>
    )
}

export default Register