import React from 'react'

import '../assets/css/login.css'

import Kite from '../assets/images/Kite.svg'

import { MDBContainer, MDBJumbotron } from 'mdbreact'
import { Form, Image, Button } from 'react-bootstrap'

import * as Yup from 'yup'
import { useFormik } from 'formik'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'

import NewField from '../components/FormField'

function Login() {

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

        onSubmit: async () => {
            // login
        },

        validationSchema
    })

    const handleSubmitFadeErrors = e => {
        handleSubmit(e)

        setValues({...values, ...{'fadeErrors': false}})

        setTimeout(() => {
            setValues({...values, ...{'fadeErrors': true}})
        }, 0)
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
            handleChange: handleChange
          }
    }

    const username = NewField(newFieldSetup('Username', 'username', 'George', 'text'))
    const password = NewField(newFieldSetup('Password', 'password', '••••••••', 'password'))

    return (
        <MDBContainer fluid className = 'main d-flex align-items-center justify-content-center'>
            <MDBJumbotron className = 'w-50 bg-primary'>

                <MDBContainer className = 'display-4 text-center'>
                    <Image fluid src = { Kite } />
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