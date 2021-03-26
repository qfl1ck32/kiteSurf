import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { MDBContainer } from 'mdbreact'
import { Dropdown, Image } from 'react-bootstrap'

import User from '../assets/images/User.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const SignInContainer = () => {
    return (
        <>
            <FontAwesomeIcon color = 'turquoise' className = 'd-inline' icon = { faSignInAlt }  />
            <MDBContainer className = 'h6 d-inline'>Sign-in</MDBContainer>
        </>
    )
}

const LogOutContainer = () => {
    return (
        <>
            <FontAwesomeIcon color = 'red' icon = { faSignOutAlt } />
            <MDBContainer className = 'h6 d-inline'>Sign-out</MDBContainer>
        </>
    )
}

function ProfileDropdown(props) {

    const [redirect, setRedirect] = useState({
        shouldRedirect: false,
        to: ''
    })

    const authOnClick = e => {
        setRedirect({
            shouldRedirect: true,
            to: props.user == null ? 'Login' : 'Logout'
        })
    }

    return redirect.shouldRedirect ? (<Redirect to = { '/' + redirect.to } />) :
    (
        <Dropdown>
            <Dropdown.Toggle variant = 'primary' id = 'dropdown'>
                <Image fluid width = { 16 } src = { props.user == null ? User : props.user.avatar } />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick = { authOnClick }> { props.user == null ?  <SignInContainer /> : <LogOutContainer /> } </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}


export default ProfileDropdown