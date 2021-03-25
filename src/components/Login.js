import React from 'react'

import '../assets/css/login.css'

import Kite from '../assets/images/Kite.svg'

import { MDBContainer, MDBJumbotron } from 'mdbreact'
import { Form, Image } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'

function Login() {

    return (
        <MDBContainer fluid className = 'main d-flex align-items-center justify-content-center'>
            <MDBJumbotron className = 'w-50 bg-primary text-dark'>

                <MDBContainer className = 'display-4 text-center'>
                    <Image fluid src = { Kite } />
                </MDBContainer>

            </MDBJumbotron>
        </MDBContainer>
    )
}

export default Login