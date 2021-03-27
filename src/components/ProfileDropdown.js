import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { MDBContainer } from 'mdbreact'
import { Dropdown, Image } from 'react-bootstrap'

import User from '../assets/images/User.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faSignInAlt, faRegistered } from '@fortawesome/free-solid-svg-icons'

const AuthContainer = props => {
    return (
        <>
            <FontAwesomeIcon color = { props.color } icon = { props.icon } />
            <MDBContainer className = 'h6 d-inline'> { props.name } </MDBContainer>
        </>
    )
}

function ProfileDropdown(props) {

    const [redirect, setRedirect] = useState({
        shouldRedirect: false,
        to: ''
    })

    const authOnClick = type => {
        setRedirect({
            shouldRedirect: true,
            to: type
        })
    }

    return redirect.shouldRedirect ? <Redirect to = { '/' + redirect.to } /> :
    (
        <Dropdown>
            <Dropdown.Toggle variant = 'primary' id = 'dropdown'>
                <Image fluid width = { 16 } src = { User } />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    props.user == null ?
                        <>
                            <Dropdown.Item onClick = { () => { authOnClick('Login') } }>
                                <AuthContainer color = 'green' icon = { faSignInAlt } name = 'Login' />
                            </Dropdown.Item>

                            <Dropdown.Item onClick = { () => { authOnClick('Register') } }>
                                <AuthContainer color = 'turquoise' icon = { faRegistered } name = 'Register' />
                            </Dropdown.Item>
                        </>
                    :
                        <Dropdown.Item onClick = { () => { authOnClick('Logout') } }>
                            <AuthContainer color = 'red' icon = { faSignOutAlt } name = 'Logout' />
                        </Dropdown.Item>
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}


export default ProfileDropdown